import { BaseModel, ModelQueryBuilder } from '@adonisjs/lucid/orm';
import { LucidModel } from '@adonisjs/lucid/types/model';
import sinon, { SinonSandbox, SinonStub } from 'sinon';

export default class SandboxModel {
  sandbox: SinonSandbox = sinon.createSandbox();

  getInstance(): SinonSandbox {
    return this.sandbox;
  }

  restore(): void {
    this.sandbox.restore();
  }

  stub(
    Model: typeof BaseModel | ModelQueryBuilder | object | any | null = null,
    method: keyof LucidModel | any | null = null
  ): SinonStub<any, any> {
    return this.sandbox.stub(Model, method);
  }

  sinon(): sinon.SinonStatic {
    return sinon;
  }
}
