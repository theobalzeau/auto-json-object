enum AJOMode {
  /**
   * FIX_TO_MODOL
   *
   * Json source will be applied only if the path is the same as the path of the object
   * when the path is different, the json source will not be applied to the child
   */
  FIX_TO_MODOL = 0,
  /**
   * JSON_TO_ALL_OBJECT
   *
   * Json source is passed to object and his childs
   * if the information is inside the json source deeply,
   * the information may not be passed to your interested object
   * during applyData, we good deep in the json source if we see the path of the object
   * either the information can be passed to the object without the good form
   */
  JSON_TO_ALL_OBJECT = 1,
  /**
   * ALL_JSON_TO_ALL_OBJECT
   *
   * Json source and all child of the json source (recursively)
   * will be applied to all object
   *
   * When applyData is called,
   * The json source and child's of the json source will be applyed
   * to the object and the child's of the object
   */
  ALL_JSON_TO_ALL_OBJECT = 2,
  INTELLIGENT = 3,
}
export default AJOMode;
