import { defineConfig, build, loadEnv } from "vite";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

// Load .env before reading port vars
const env = loadEnv("development", process.cwd(), "");

const MODULE_ID = "eidolon-utilities";
const MODULE_PATH = `/modules/${MODULE_ID}`;
const FOUNDRY_PORT = env.FOUNDRY_PORT || 30001;
const DEV_SERVER_PORT = env.DEV_SERVER_PORT || 30011;

/**
 * Serve Handlebars templates raw (no Vite HTML transforms).
 */
function serveTemplatesRaw() {
  return {
    name: "serve-templates-raw",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const templatePrefix = `${MODULE_PATH}/templates/`;
        if (!req.url?.startsWith(templatePrefix)) return next();

        const relativePath = req.url.slice(MODULE_PATH.length + 1);
        const filePath = path.resolve(process.cwd(), relativePath);

        try {
          const fileStat = await stat(filePath);
          if (!fileStat.isFile()) return next();

          const content = await readFile(filePath, "utf-8");
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(content);
        } catch {
          res.statusCode = 404;
          res.end("Not found");
        }
      });
    }
  };
}

/**
 * Auto-rebuild on source changes + serve built bundle with no-cache.
 *
 * How it works:
 * 1. Watches scripts/, styles/, src/ for changes
 * 2. On change, runs a full Vite library build → dist/
 * 3. Intercepts requests for the module's JS/CSS and serves from dist/
 *    with no-cache headers, bypassing Foundry's aggressive caching
 * 4. Browser refresh (F5) picks up the fresh build
 */
function autoRebuild() {
  const buildConfig = {
    configFile: false,
    logLevel: "warn",
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
      reportCompressedSize: false,
      lib: {
        entry: "src/eidolon-utilities.entry.js",
        formats: ["es"],
        fileName: () => "eidolon-utilities.js"
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith(".css")) return "eidolon-utilities.css";
            return assetInfo.name || "[name][extname]";
          }
        }
      }
    }
  };

  return {
    name: "foundry-module-dev",
    configureServer(server) {
      let isBuilding = false;
      let buildQueued = false;

      const triggerBuild = async () => {
        if (isBuilding) {
          buildQueued = true;
          return;
        }
        isBuilding = true;
        const start = Date.now();
        console.log("[DEV] Rebuilding...");
        try {
          await build(buildConfig);
          console.log(`[DEV] Build complete in ${Date.now() - start}ms`);
        } catch (e) {
          console.error("[DEV] Build error:", e);
        } finally {
          isBuilding = false;
          if (buildQueued) {
            buildQueued = false;
            triggerBuild();
          }
        }
      };

      // Watch source directories
      for (const dir of ["scripts", "styles", "src"]) {
        const abs = path.resolve(process.cwd(), dir);
        server.watcher.add(abs);
        console.log(`[DEV] Watching: ${abs}`);
      }

      server.watcher.on("change", (file) => {
        if (file.endsWith(".js") || file.endsWith(".css")) {
          console.log(`[DEV] Changed: ${path.relative(process.cwd(), file)}`);
          triggerBuild();
        }
      });

      // Serve built JS + CSS from dist/ with no-cache headers
      const servedFiles = {
        [`${MODULE_PATH}/eidolon-utilities.js`]: { disk: "dist/eidolon-utilities.js", mime: "application/javascript" },
        [`${MODULE_PATH}/eidolon-utilities.css`]: { disk: "dist/eidolon-utilities.css", mime: "text/css" },
      };

      server.middlewares.use(async (req, res, next) => {
        const entry = servedFiles[req.url];
        if (!entry) return next();
        try {
          const content = await readFile(path.resolve(entry.disk), "utf-8");
          res.setHeader("Content-Type", entry.mime);
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.end(content);
        } catch (e) {
          console.error(`[DEV] Error serving ${req.url}:`, e.message);
          next();
        }
      });

      // Initial build so dist/ is fresh when the server starts
      triggerBuild();
      console.log(`[DEV] Auto-rebuild enabled. Browse Foundry at http://localhost:${DEV_SERVER_PORT}`);
    }
  };
}

export default defineConfig({
  base: MODULE_PATH + "/",

  plugins: [serveTemplatesRaw(), autoRebuild()],

  server: {
    port: Number(DEV_SERVER_PORT),
    strictPort: true,
    open: false,
    proxy: {
      "/socket.io": {
        target: `ws://localhost:${FOUNDRY_PORT}`,
        ws: true
      },
      [`^(?!${MODULE_PATH})`]: {
        target: `http://localhost:${FOUNDRY_PORT}`,
        changeOrigin: true
      }
    }
  },

  esbuild: {
    keepNames: true
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: "src/eidolon-utilities.entry.js",
      formats: ["es"],
      fileName: () => "eidolon-utilities.js"
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "eidolon-utilities.css";
          }
          return assetInfo.name || "[name][extname]";
        }
      }
    }
  }
});
