import { Directive, inject, TemplateRef } from "@angular/core";

@Directive({
  selector: '[comTemplateDef]',
})
export abstract class ComTemplateDefBase {
  template = inject<TemplateRef<any>>(TemplateRef);
}