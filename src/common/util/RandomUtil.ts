export class RandomUtil {
    static randomPick<V, T>(EnumType: T): V {
        const keys = Object.keys(EnumType);
        return EnumType[keys[Math.floor(Math.random() * keys.length)]] as V;
    }

    static randomRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
