```ts
/**
 * Converts a property into a "private" property + getter/setter
 * the setter will also call a 'changed' method with the propertyKey
 * and new value if it exists
 */
const field: PropertyDecorator = (target, key) => {
    if (Reflect.deleteProperty(target, key)) {
        Object.defineProperty(target, key, {
            get() { 
                return this[`_${String(key)}`];
            },
            set(newVal) { 
                this[`_${String(key)}`] = newVal;
                if(Reflect.has(this, 'changed'))
                    this.changed(key, newVal)
            },
            enumerable: true,
            configurable: true
        });
    }
};

/**
 * Enables comb-inheritance via the "parent" property to eliminate the 
 * chain-of-responsibility pattern
 */ 
const agentProxyHandler: ProxyHandler<Agent> = {
    get(target, propertyKey, receiver) {
        if (Reflect.has(target, propertyKey))
            return Reflect.get(target, propertyKey, receiver)
        else if (target.parent != null && Reflect.has(target.parent, propertyKey))
            return Reflect.get(target.parent, propertyKey, target.parent)
        else
            throw new Error(`No such property: ${String(propertyKey)}`)
    }
}

/** */
abstract class Model { }

/** */
abstract class View { }

/** */
interface AgentOptions {
    model?: Model;
    view?: View;
}

/** */
abstract class Agent {
    @field model?: Model
    private _parent?: Container
    @field view?: View

    constructor({model, view}: AgentOptions = {}) {
        return Object.assign(new Proxy(this, agentProxyHandler), {model, view})
    }

    /**
     * Does the agent have a parent assigned?
     */
    get hasParent() { return this.parent != null }

    get parent(): Container { return this.parent }
}

interface ContainerOptions extends AgentOptions {
    children?: Agent[]
}

abstract class Container extends Agent {
    private _children: Agent[] = []

    constructor(options: ContainerOptions) {
        super(options)
        options.children?.forEach(child => this.addChild(child))
    }

    get children() { return [...this._children] }

    addChild(newChild: Agent) {
        if(newChild.hasParent)
            throw new Error("Unable to add child, it must first be removed from its parent")
        this.children.push(newChild)
        newChild._parent = this
    }

    removeChild(oldChild: Agent) {
        if(!oldChild.hasParent)
            throw new Error("Unable to remove child, it does not have a parent")
        this._children = this._children.filter(child => child !== oldChild)
        oldChild._parent = null
    }
}
```

<http://peter.michaux.ca/articles/smalltalk-mvc-translated-to-javascript>
<http://peter.michaux.ca/articles/mvc-architecture-for-javascript-applications>
<https://stackoverflow.com/questions/3959546/what-does-bindable-mean-in-actionscript>
<https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/core/Container.html>
<https://semantic-ui.com/modules/tab.html#/definition>
<https://material.angular.io/components/tabs/overview>
<https://technobytz.com/flex-preinitialize.html>
<https://www.tutorialspoint.com/flex/flex_tabnavigator_control.htm>
<https://github.com/jeremyruppel/as3-router>
<https://fritzthecat-blog.blogspot.com/2017/03/hierarchical-mvc.html>
<http://web.archive.org/web/20211104225948/https://www.adobe.com/content/dam/acom/en/devnet/actionscript/pdfs/ora_as3_design_patterns_ch12.pdf>

[MVC Analog Clock](https://codepen.io/mlhaufe/pen/eYGpBzE)
[PAC Clock](https://codepen.io/mlhaufe/pen/BawZjJb)
[Drag and resize example](https://codepen.io/mlhaufe/pen/RwKqzvr?editors=0010)
[Angular](https://angular.io/start)
[React](https://reactjs.org/)
[Vue.js](https://vuejs.org/)
[Svelte](https://svelte.dev/)
[Bootstrap](https://getbootstrap.com/)

## Components

- <https://docs.oracle.com/javase/7/docs/api/java/awt/Component.html>
- Wizard
  - extends form
  - Each tab is a fieldset
  - becomes accordian on mobile

## Container

- <https://docs.oracle.com/javase/7/docs/api/java/awt/Container.html>

## Event Model

## Link Dump

- <https://www.infoworld.com/article/2076128/hmvc--the-layered-pattern-for-developing-strong-client-tiers.html#resources>
- <https://www.typescriptlang.org/play?#code/IYIwzgLgTsDGEAJYBthjAg8uAplAbnggN4BQCFCADlAPYQ7w4AmCA+gBbAB2zyOAUULcIAChwAuBEJwiAlCXKVl-RAFscEDrWYA5YBoQBeBDgB0EAJ5VzUHFVSwcogPQA9UWbkuANAgDkACQAjP5yFrQAqlQ2UADCaM5yANxKyhSiWgCWGGgIPJZyANr+tNz+CADUphbWOAC64ilpCAC+pO2koJAw8Eio6Fi4BKD8ihQ09IwMrGy0w4RQYFLYYHiLRfXGCJukSvNrBM4H63grC3gKZMpZAGYImRw5ZnMXS2ZZvDgAHpi3oicjlAFAA+BAAWmCchaFC0dAA7ghuDhEQIoHQoKJ-KtTlB8sg7MBmJZ8sxmCwwi1smAXoDFjSqABXMAcAFvaEUToURncOnHN7nQ6LK4tO4Pam0t40z7k37-PnA4wmSEc9Jw2iI5Go9G0THYt4IZi0HAYXmIH45CCU5QS15CvAYEy2hU025ZZAMTG0Yxg71Gf0IBWqrlI+h3SyiZjACDAKQFEXKFwuJC0Kgk4Do4AkkA4W66nAIRlUKMMBCfJCJQPIwP3LQFoslk0INQ6O5ZJt1-KZyxUp40u24mlgZBZJyiAAM4TzUAEcFZft9Zgb0ecJeAcmDHT23WgcEQKDQGAAsjocMhTN8GLwMDiRiAxsQ2l1wLu+gfBgA1duIn5X5g3g1HxaSYGCYVgd16RBOAgNRkAEfgNBEKQAAkABUjwAGXgnBEIgFpYDKHpGXgXVRBA6YWHYFtyWQKQTxohN0goNhqLPMw+UeZ4yjiLhuAAc3MEAZU4sANxadplG43iBNEORiHadoIL3fpDwQOIymgWhkH4PF5L2UgXAAKmMkzTLM8yLMsqyLJcAzrPshzHPM2yjKctz3OcvZXPIQyEAAEWjWNqDoWIIHbDAymQHsEGM2z3wwVCskMa5KAI7giJIzEYUoJl71HBBtEZKApG4Rk1BzKAfGyiZGTy2Bm0+RkGBKsqKqqpiarqhA1jS5gWvKvAWiuNplC3OzDJ8hAfLigYMDiZBaFgABreizwvP9j1Pc8UooNKMogUjyLA9gwo0KREo0YawCLPBZKfZQBMQU6khIBA7AgIruAQW1nvuyg1iepLnHwYBkEZSQEAunBGKYn6ge2EGwZwarvr7MwzXDUREfB1VOTGpS31mtSFuWr8UXW2R-wQMnER24KpmO6DYOw3DtiNWAytkCAzFgQkGBZrmsVgHgQbAa1UsI6BiIOzFWNo4nFpWraYfSa7YlEOXcfSOX2IuESl2LFczCE3gRLE5QJMoAnEGXBhZKkfBaCyZgxvihAAEFuFB2g+PmxWaYp68FdJ79xgl9KpcyjWtqkP3ltW5AVeUNXbs1lHbWYGB4TjpbZPEvZlCOmZ2Ez4Bs5J3Ok8oDOs4AMTgJJ07RthS-hZCeH-POLYLnK6FA4uW7rhu7rp0bu+AvuKNmVv2+vWS9JaW2XtHyh89aIA>
- <https://duckduckgo.com/?q=ZenObservable&t=brave&ia=software>
- <https://docs.sencha.com/extjs/6.7.0/guides/application_architecture/application_architecture.html>
- <https://en.wikipedia.org/wiki/Event_(computing>)
- <https://weblogs.asp.net/nannettethacker/html-tables-to-asp-net-table-controls>
- <https://www.deque.com/axe/>
- <https://duckduckgo.com/?q=.storybook+folder&t=brave&ia=web>
- <https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/core/UIComponent.html>
- <https://news.ycombinator.com/item?id=19076360>
