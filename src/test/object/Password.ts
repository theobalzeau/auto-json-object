import { AJOData, AJOProperties, AJOElement } from '../../index';

export default class Password extends AJOData {
  hash: AJOProperties;
  salt: AJOProperties;

  constructor(field: string, ajo_parent: AJOElement | null = null) {
    super(field, ajo_parent);

    this.hash = new AJOProperties('hash', this);
    this.salt = new AJOProperties('salt', this);
  }
}
