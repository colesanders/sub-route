import {ComponentFactory, ComponentFactoryResolver, Injector, Type} from '@angular/core';
import {AngularDelegate, ModalController} from '@ionic/angular';
import {provideRootTree, provideRouteTree} from './sub-route.providers';

const createInjector = (component: ComponentFactory<any>) => (injector: Injector, ...args) =>
  component.create(Injector.create({
    providers: [provideRootTree(component), provideRouteTree()],
    parent: injector
  }), ...args);

class SubRouteComponentFactoryResolver implements ComponentFactoryResolver{
  constructor(resolver: ComponentFactoryResolver) {
  }

  resolveComponentFactory<T>(component: Type<T>, ...args): ComponentFactory<T> {
    return undefined;
  }
}

const createResolver = (res: ComponentFactoryResolver): ComponentFactoryResolver => ({
  resolveComponentFactory<T>(component: Type<T>, ...args) {
    // console.warn('Component', component);
    const comp = res.resolveComponentFactory(component);
    const wrap = {
      get componentType() {
        return comp.componentType;
      },
      get inputs() {
        return comp.inputs;
      },
      get ngContentSelectors() {
        return comp.ngContentSelectors;
      },
      get outputs() {
        return comp.outputs;
      },
      get selector() {
        return comp.selector;
      },
      create: createInjector(comp)
    };
    // args?.length > 0 ? console.error('UNTRACKED ARGUMENTS', args) : void 0;
    return wrap;
  }
});

const modalControllerFactory = (del, resolver: ComponentFactoryResolver, injector: Injector) =>
  new ModalController(del, createResolver(resolver), injector);

export const provideModalController = () => ({
  provide: ModalController,
  useFactory: modalControllerFactory,
  deps: [AngularDelegate, ComponentFactoryResolver, Injector]
});
