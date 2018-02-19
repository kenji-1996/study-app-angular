import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'nb-home',
        link: '/app/home',
        home: true,
    },
    /*{ //Title of navlist
        title: 'FEATURES',
        group: true,
    },*/
    {
        title: 'User',
        icon: 'nb-person',
        children: [
            {
                title: 'Profile',
                link: '/app/user/profile',
            },
            {
                title: 'Sign out',
                link: '/app/user/sign-out',
            },
        ],
    },
    {
        title: 'Tests',
        icon: 'nb-compose',
        children: [
            {
                title: 'My tests',
                link: '/app/user/tests',
            },
            {
                title: 'Allocated tests',
                link: '/app/user/allocated-tests',
            },
            {
                title: 'Browser',
                link: '/app/user/browse',
            },
            {
                title: 'Test',
                link: '/app/user/test/selected',
                hidden: true,
            },
            {
                title: 'Test',
                link: '/app/user/test/live',
                hidden: true,
            },
            {
                title: 'Test',
                link: '/app/user/test/edit',
                hidden: true,
            },
            {
                title: 'Test',
                link: '/app/user/test/result',
                hidden: true,
            },
        ],
    },
    {
        title: 'Author',
        icon: 'nb-title',
        children: [
            {
                title: 'Tests',
                link: '/app/author/tests',
            },
            {
                title: 'Create',
                link: '/app/author/create',
            },
            {
                title: 'Mark',
                link: '/app/author/review',
            },
            {
                title: 'Review',
                link: '/app/author/review',
                hidden: true,
            },
            {
                title: 'Review',
                link: '/app/author/edit',
                hidden: true,
            },
            /*{
                title: 'Test',
                link: '/tests/selected',
                hidden: true,
            },*/
        ],
    },
    /*{
        title: 'UI Features',
        icon: 'nb-keypad',
        link: '/pages/ui-features',
        children: [
            {
                title: 'Buttons',
                link: '/pages/ui-features/buttons',
            },
            {
                title: 'Grid',
                link: '/pages/ui-features/grid',
            },
            {
                title: 'Icons',
                link: '/pages/ui-features/icons',
            },
            {
                title: 'Modals',
                link: '/pages/ui-features/modals',
            },
            {
                title: 'Typography',
                link: '/pages/ui-features/typography',
            },
            {
                title: 'Animated Searches',
                link: '/pages/ui-features/search-fields',
            },
            {
                title: 'Tabs',
                link: '/pages/ui-features/tabs',
            },
        ],
    },
    {
        title: 'Components',
        icon: 'nb-gear',
        children: [
            {
                title: 'Tree',
                link: '/pages/components/tree',
            }, {
                title: 'Notifications',
                link: '/pages/components/notifications',
            },
        ],
    },
    {
        title: 'Maps',
        icon: 'nb-location',
        children: [
            {
                title: 'Google Maps',
                link: '/pages/maps/gmaps',
            },
            {
                title: 'Leaflet Maps',
                link: '/pages/maps/leaflet',
            },
            {
                title: 'Bubble Maps',
                link: '/pages/maps/bubble',
            },
        ],
    },
    {
        title: 'Charts',
        icon: 'nb-bar-chart',
        children: [
            {
                title: 'Echarts',
                link: '/pages/charts/echarts',
            },
            {
                title: 'Charts.js',
                link: '/pages/charts/chartjs',
            },
            {
                title: 'D3',
                link: '/pages/charts/d3',
            },
        ],
    },
    {
        title: 'Editors',
        icon: 'nb-title',
        children: [
            {
                title: 'TinyMCE',
                link: '/pages/editors/tinymce',
            },
            {
                title: 'CKEditor',
                link: '/pages/editors/ckeditor',
            },
        ],
    },
    {
        title: 'Tables',
        icon: 'nb-tables',
        children: [
            {
                title: 'Smart Table',
                link: '/pages/tables/smart-table',
            },
        ],
    },
    {
        title: 'Auth',
        icon: 'nb-locked',
        children: [
            {
                title: 'Login',
                link: '/auth/login',
            },
            {
                title: 'Register',
                link: '/auth/register',
            },
            {
                title: 'Request Password',
                link: '/auth/request-password',
            },
            {
                title: 'Reset Password',
                link: '/auth/reset-password',
            },
        ],
    },*/
];
