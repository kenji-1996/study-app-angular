/**
 * Created by Kenji on 1/19/2018.
 */
import {
    trigger,
    style,
    animate,
    transition,
    state,
    group,
} from '@angular/animations';

export const fadeAnimate = trigger('fadeInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
    ]),
    transition(':leave', [   // :leave is alias to '* => void'
        animate(300, style({ opacity: 0 }))
    ])
]);

export const SlideInOutAnimation = trigger('slideInOut', [
    state('in', style({
        overflow: 'hidden',
        height: '*',
    })),
    state('out', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
    })),
    transition('in => out', animate('400ms ease-in-out')),
    transition('out => in', animate('400ms ease-in-out'))
]);

/*trigger('slideInOut', [
        state('in', style({
            'max-height': 'auto','opacity': '1', 'visibility': 'visible'//
        })),
        state('out', style({
            'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
        })),
        transition('in => out', [group([
                animate('400ms ease-in-out', style({
                    'opacity': '0'
                })),
                animate('600ms ease-in-out', style({
                    'max-height': '0px'
                })),
                animate('700ms ease-in-out', style({
                    'visibility': 'hidden'
                }))
            ]
        )]),
        transition('out => in', [group([
                animate('1ms ease-in-out', style({
                    'visibility': 'visible'
                })),
                animate('600ms ease-in-out', style({
                    'max-height': 'auto'
                })),
                animate('800ms ease-in-out', style({
                    'opacity': '1'
                }))
            ]
        )])
    ]);*/