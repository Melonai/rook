export default function <F extends Function>(to: object, f: F): F {
    return f.bind(to);
}
