import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';

@Directive({ selector: '[a2aHighlight]' })
export class HighlightDirective {
    private _defaultColor = 'red';

    constructor(private el: ElementRef, private renderer: Renderer) { }

    @Input('a2aHighlight') highlightColor: string;

    @Input() set defaultColor(colorName: string){
        this._defaultColor = colorName || this._defaultColor;
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.highlight(this.highlightColor || this._defaultColor);
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlight(null);
    }

    private highlight(color: string) {
        this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', color);
    }
}

/** Attribute Directives in Angular 2
 * 
 * Structural directives can change the DOM layout by adding and removing DOM elements. NgFor and NgIf are two familiar examples.
 * 
 * An attribute directive minimally requires building a controller class annotated with @Directive, which specifies the selector 
 * identifying the attribute associated with the directive. The controller class implements the desired directive behavior.
 * 
 * - We need the Directive symbol for the @Directive decorator. 
 * - We need the ElementRef to inject into the directive's constructor so we can access the DOM element. 
 * - We also need Renderer so we can change the DOM element's style.
 * - @Input adds metadata to the class that makes the highlightColor property available for property binding under the myHighlight 
 *        alias. We must add this input metadata or Angular will reject the binding.
 * 
 * We define the directive metadata in a configuration object passed as an argument to the @Directive decorator function. @Directive
 * requires a CSS selector to identify the HTML in the template that is associated with our directive. The CSS selector for an attribute 
 * is the attribute name in square brackets. Our directive's selector is [a2aHighlight]. Angular will locate all elements in the  
 * template that have an attribute named a2aHighlight.
 * 
 * After the @Directive metadata comes the directive's controller class, which contains the logic for the directive. We export 
 * `HighlightDirective` to make it accessible to other components. Angular creates a new instance of the directive's controller class for 
 * each matching element, injecting an Angular ElementRef and Renderer into the constructor. ElementRef is a service that grants us direct 
 * access to the DOM element through its nativeElement property and with Renderer we can set the element style.
 * 
 * We need to detect when the user hovers into and out of the element, and respond to those actions by setting and clearing the highlight color.
 * We apply the @HostListener decorator to methods which are called when an event is raised. The @HostListener decorator refersto the DOM element 
 * that hosts our attribute directive, the <p> in our case. We'll extend our directive class with a bindable input highlightColor property and 
 * use it when we highlight text. The highlightColor property is called an input property because data flows from the binding expression 
 * into our directive. Notice the @Input() decorator applied to the property. (4th bullet above) With the highlight color as an input, we modified 
 * the onMouseEnter() method to use it instead of the hard-coded color name. We also define red and violet as default colors to fallback on in 
 * case the user neglects to bind with a color.
 * 
 * Note the radio button click handlers in the template set a color property and we are binding that color to the directive. We should expect to 
 * find a color on the host AppComponent, but we don't. Angular dynamically added a color property to the runtime instance of the AppComponent which
 * is convenient behavior but it is also implicit behavior that could be confusing. While it's cool that this technique works, it's recommended
 * to add the color property to the AppComponent.
 * 
 * @Input(alias): aliasing allows us to follow naming conventions or signal intentions. The name inside the directive should express the intent 
 * of the developer and may need to follow standardized naming conventions.
 * 
 * Two mouse event handlers delegate to a helper method that sets the color via a private local variable, el. We revised the constructor to 
 * capture the ElementRef.nativeElement in this variable.
 * 
 * The defaultColor property has a setter that overrides the hard-coded default color, "red". We don't need a getter. How do we bind to it? 
 * We already "burned" the myHighlight attribute name as a binding target. Remember that a component is a directive too. We can add as many 
 * component property bindings as we need by stringing them along in the template that sets the properties to the string literals.
 *          example: <my-component [a]="'a'" [b]="'b'" [c]="'c'"><my-component>
 * 
 * We do the same thing with an attribute directive: <p [myHighlight]="color" [defaultColor]="'violet'">
 * 
 * What Happened? Angular found the a2aHighlight attribute on the <p> element. It created an instance of the HighlightDirective class, injecting 
 * a reference to the element into the constructor where we set the <p> element's background style to yellow or chose a different color by 
 * using a radio selection.  
 * 
 * 
 * Appendix: Input properties
 * We declared the highlightColor property to be an input property of our HighlightDirective - why? Angular makes a subtle but important 
 * distinction between binding sources and targets. In all previous bindings, the directive or component property was a binding source. 
 * - A property is a source if it appears in the template expression to the right of the equals (=).
 * - A property is a target when it appears in square brackets ([ ]) to the left of the equals (=) ... as it is does when we bind to the 
 * myHighlight property of the HighlightDirective, <p [a2aHighlight]="color">Highlight this!</p>
 * 
 * The 'color' in [myHighlight]="color" is a binding source. A source property doesn't require a declaration.
 * The 'myHighlight' in [myHighlight]="color" is a binding target. We must declare it as an input property. Angular rejects the binding with an
 * error if we don't.
 * 
 * Angular treats a target property differently for a good reason. A component or directive in target position needs protection from people who 
 * would bind to every property available. Less is best. We just need to trust the Angular's creators' word about that.
 * The input declaration ensures that consumers of our directive can only bind to the properties of our public API ... nothing else.
 */