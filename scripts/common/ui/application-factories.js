/**
 * Build a factory helper that instantiates an ApplicationV2-derived class.
 * @template {typeof foundry.applications.api.ApplicationV2} ApplicationCtor
 * @param {ApplicationCtor} ApplicationClass The application constructor to instantiate.
 * @param {object} [defaultOptions] Base options applied to every instance.
 * @returns {(options?: object) => InstanceType<ApplicationCtor>}
 */
export function createApplicationFactory(ApplicationClass, defaultOptions = {}) {
  if (typeof ApplicationClass !== "function") {
    throw new TypeError("createApplicationFactory requires a constructor function.");
  }

  const factory = function applicationFactory(options = {}) {
    const mergedOptions = foundry.utils.mergeObject(
      defaultOptions ?? {},
      options ?? {},
      { inplace: false }
    );
    return new ApplicationClass(mergedOptions);
  };

  factory.__eidolonFactorySignature = "options";
  factory.__eidolonFactoryTarget = ApplicationClass;

  return factory;
}

