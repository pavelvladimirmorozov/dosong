import { Directive } from "@angular/core";
import { ComTemplateDefBase } from "../base/base-content.directive";

@Directive({
    selector: '[comSelectContentSlot]',
  })
export class ComSelectContentSlot extends ComTemplateDefBase {}


@Directive({
    selector: '[comSelectIconSlot]',
  })
export class ComSelectIconContent extends ComTemplateDefBase {}
