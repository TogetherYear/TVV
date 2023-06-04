class Mathf {
    static Clamp(min: number, max: number, value: number): number {
        if (value < min) {
            return min
        }
        else if (value > max) {
            return max
        }
        else {
            return value
        }
    }

    static Lerp(a: number, b: number, weight: number) {
        return a + (b - a) * weight
    }

    /**
     * 获取俩个经纬度之间的距离
     */
    static GetDistance(l: [number, number], r: [number, number]) {
        let radLat1 = this.Rad(l[1]);
        let radLat2 = this.Rad(r[1]);
        let a = radLat1 - radLat2;
        let b = this.Rad(l[0]) - this.Rad(r[0]);
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6371000;
        s = Math.round(s * 10000) / 10000;
        return s;
    }

    /**
     * 转化为弧度(rad)
     */
    static Rad(d: number) {
        return d * Math.PI / 180.0
    }

    /**
     * 判断俩条线是否相交
     */
    static IsLineLineIntersect(custom: { a: { x: number, y: number }, b: { x: number, y: number } }, block: { c: { x: number, y: number }, d: { x: number, y: number } }) {
        const EPSINON = 1e-15
        const area_abc = (custom.a.x - block.c.x) * (custom.b.y - block.c.y) - (custom.a.y - block.c.y) * (custom.b.x - block.c.x)
        const area_abd = (custom.a.x - block.d.x) * (custom.b.y - block.d.y) - (custom.a.y - block.d.y) * (custom.b.x - block.d.x)
        if (area_abc * area_abd >= -EPSINON) {
            return false
        }
        const area_cda = (block.c.x - custom.a.x) * (block.d.y - custom.a.y) - (block.c.y - custom.a.y) * (block.d.x - custom.a.x)
        const area_cdb = area_cda + area_abc - area_abd
        if (area_cda * area_cdb >= - EPSINON) {
            return false
        }
        return true
    }

    /**
     * 判断俩条线是否相交 并且返回交点坐标
     */
    static GetLinesCrossoverPoint(custom: { a: { x: number, y: number }, b: { x: number, y: number } }, block: { c: { x: number, y: number }, d: { x: number, y: number } }) {
        const EPSINON = 1e-15
        const area_abc = (custom.a.x - block.c.x) * (custom.b.y - block.c.y) - (custom.a.y - block.c.y) * (custom.b.x - block.c.x)
        const area_abd = (custom.a.x - block.d.x) * (custom.b.y - block.d.y) - (custom.a.y - block.d.y) * (custom.b.x - block.d.x)
        if (area_abc * area_abd >= -EPSINON) {
            return { r: false, intersect: { x: 0, y: 0 } }
        }
        const area_cda = (block.c.x - custom.a.x) * (block.d.y - custom.a.y) - (block.c.y - custom.a.y) * (block.d.x - custom.a.x)
        const area_cdb = area_cda + area_abc - area_abd
        if (area_cda * area_cdb >= - EPSINON) {
            return { r: false, intersect: { x: 0, y: 0 } }
        }
        const t = area_cda / (area_abd - area_abc)
        const dx = t * (custom.b.x - custom.a.x)
        const dy = t * (custom.b.y - custom.a.y)
        const intersect = { x: custom.a.x + dx, y: custom.a.y + dy }
        return { r: true, intersect: intersect }
    }

    /**
     * 判断点是否在闭合区域内
     */
    static IsPointInPolygon(point: [number, number], polygon: Array<[number, number]>) {
        let result: Array<number> = []
        for (let p of polygon) {
            result.push(p[0], p[1])
        }
        let n = result.length >> 1;

        let ax, lup;
        let ay = result[2 * n - 3] - point[1];
        let bx = result[2 * n - 2] - point[0];
        let by = result[2 * n - 1] - point[1];

        if (bx === 0 && by === 0) return false;

        for (let ii = 0; ii < n; ii++) {
            ax = bx;
            ay = by;
            bx = result[2 * ii] - point[0];
            by = result[2 * ii + 1] - point[1];
            if (bx === 0 && by === 0) return false;
            if (ay === by) continue;
            lup = by > ay;
        }

        let depth = 0;
        for (let i = 0; i < n; i++) {
            ax = bx;
            ay = by;
            bx = result[2 * i] - point[0];
            by = result[2 * i + 1] - point[1];
            if (ay < 0 && by < 0) continue;
            if (ay > 0 && by > 0) continue;
            if (ax < 0 && bx < 0) continue;

            if (ay === by && Math.min(ax, bx) < 0) return true;
            if (ay === by) continue;

            let lx = ax + ((bx - ax) * -ay) / (by - ay);
            if (lx === 0) return false;
            if (lx > 0) depth++;
            if (ay === 0 && lup && by > ay) depth--;
            if (ay === 0 && !lup && by < ay) depth--;
            lup = by > ay;
        }
        return (depth & 1) === 1;
    }

}

export { Mathf }