namespace I {
    export interface IHeaderBarOptionItem {
        type: string;
        icon: string;
        label: string;
    }

    export type MenuItem = {
        icon: string;
        key: string;
        check: boolean;
        id: string;
    };

    export namespace Theme {
        export const enum Style {
            Dark = 'Dark',
            Light = 'Light'
        }
    }
}
export { I };
