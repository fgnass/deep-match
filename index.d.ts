declare module 'deep-match' {
    export type DeepMatchOpts = {
        arrayOrderMatters?: boolean;
    }
    export default function deepMatch(source: any, match: any | ((source: any) => boolean), opts?: DeepMatchOpts): boolean
}