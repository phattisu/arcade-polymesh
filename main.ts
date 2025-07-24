
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    export enum Angles {
        //% block="Angle x"
        AngleX = 0,
        //% block="Angle y"
        AngleY = 1,
        //% block="Angle z"
        AngleZ = 2,
    }
    export enum Cameras {
        //% block="Camera x"
        CamX = 0,
        //% block="Camera y"
        CamY = 1,
        //% block="Camera z"
        CamZ = 2,
        //% block="Camera zoom"
        Zoom = 3,
        //% block="Camera distance"
        Dist = 4,
    }
    export enum PointProp {
        //% block="x"
        x = 0,
        //% block="y"
        y = 1,
        //% block="z"
        z = 2,
        //% block="vx"
        vx = 3,
        //% block="vy"
        vy = 4,
        //% block="vz"
        vz = 5,
    }
    export enum PivotPos {
        //% block="Pivot x"
        PivotX = 0,
        //% block="Pivot y"
        PivotY = 1,
        //% block="Pivot z"
        PivotZ = 2,
    }
    export enum SortingMethods {
        //% block="accurate"
        Accurate = 0,
        //% block="fast"
        Fast = 1,
    }
    export enum MeshFlags {
        //% block="Invisible"
        Invisible = 0,
        //% block="Non culling"
        Noncull = 1,
        //% block="Back face"
        Backface = 2,
    }

    //% blockid=poly_sorttype
    //% block="set sorting method to $method"
    //% group="sorting"
    //% weight=10
    export function sortingMethod(method: SortingMethods) {
        sort = method
    }

    //% blockid=poly_newmesh
    //% block="create new mesh"
    //% blockSetVariable=myMesh
    //% group="create"
    //% weight=10
    export function newmesh() { return new mesh() }

    export class mesh {
        public faces: { indices: number[], color: number, img?: Image }[]
        public points: { x: number, y: number, z: number }[]
        public pivot: { x: number, y: number, z: number}
        public rot: { x: number, y: number, z: number }
        public pos: { x: number, y: number, z: number, vx: number, vy: number, vz: number}
        flag: { invisible: boolean, noncull: boolean, backface: boolean}
        __home__() {
            forever(() => {
                const delta = game.currentScene().eventContext.deltaTimeMillis
                if (this.pos.vx !== 0) this.pos.x += this.pos.vx * delta;
                if (this.pos.vy !== 0) this.pos.y += this.pos.vy * delta;
                if (this.pos.vz !== 0) this.pos.z += this.pos.vz * delta;
            })
        }

        constructor() {
            this.faces = []
            this.points = []
            this.pivot = { x: 0, y: 0, z: 0 }
            this.rot = { x: 0, y: 0, z: 0 }
            this.pos = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
            this.flag = { invisible: false, noncull: false, backface: false }

            this.__home__()
        }

        //% blockid=poly_flag_set
        //% block=" $this set flag of $flag right? $ok=toggleYesNo"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="Flag mesh"
        //% weight=10
        public setFlag(flag: MeshFlags, ok: boolean) {
            switch (flag) {
                case 0: default: this.flag.invisible = ok; break
                case 1: this.flag.noncull = ok; break
                case 2: this.flag.backface = ok; break
            }
        }

        //% blockid=poly_flag_get
        //% block=" $this get flag of $flag"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="Flag mesh"
        //% weight=5
        public getFlag(flag: MeshFlags) {
            switch (flag) {
                case 0: default: return this.flag.invisible;
                case 1: return this.flag.noncull;
                case 2: return this.flag.backface;
            }
            return false
        }

        //% blockid=poly_addvertice
        //% block=" $this set vertice at $idx to x: $x y: $y z: $z"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=10
        public setVertice(idx: number, x: number, y: number, z: number) { this.points[idx] = { x: x, y: y, z: z } }

        //% blockid=poly_setface
        //% block=" $this set face at $idx to color $c=colorindexpicker and idc1 $i1 idc2 $i2|| idc3 $i3 idc4 $i4 and texture $img=screen_image_picker"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=9
        public setFace(idx: number, c: number, i1: number, i2: number, i3?: number, i4?: number, img?: Image) {
            const indice = [i1, i2]
            if (i3) indice.push(i3);
            if (i4) indice.push(i4);
            if (indice.length > 3 && img) this.faces[idx] = { indices: indice, color: c, img: img };
            else this.faces[idx] = { indices: indice, color: c };
        }

        //% blockid=poly_addvertice
        //% block=" $this add vertice to x: $x y: $y z: $z"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=8
        public addVertice(x: number, y: number, z: number) { this.points.push({ x: x, y: y, z: z }) }

        //% blockid=poly_setface
        //% block=" $this add face to color $c=colorindexpicker and idc1 $i1 idc2 $i2|| idc3 $i3 idc4 $i4 and texture $img=screen_image_picker"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=7
        public addFace(c: number, i1: number, i2: number, i3?: number, i4?: number, img?: Image) {
            const indice = [i1, i2]
            if (i3) indice.push(i3);
            if (i4) indice.push(i4);
            if (indice.length > 3 && img) this.faces.push({ indices: indice, color: c, img: img });
            else this.faces.push({ indices: indice, color: c });
        }

        //% blockid=poly_delvertice
        //% block=" $this remove vertice|| at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh remover"
        //% weight=10
        public delVertice(idx?: number) {
            if (idx) this.points.removeAt(idx);
            else this.points.pop();
        }

        //% blockid=poly_delface
        //% block=" $this remove face|| at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh remover"
        //% weight=9
        public delFace(idx?: number) {
            if (idx) this.faces.removeAt(idx);
            else this.faces.pop();
        }

        //% blockid=poly_setfacecolor
        //% block=" $this set face color at $idx to $c=colorindexpicker"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh face property"
        //% weight=10
        public setFaceColor(idx: number, c: number) {
            if (this.faces[idx].color === c) return;
            this.faces[idx].color = c
        }

        //% blockid=poly_setfaceimage
        //% block=" $this set face image at $idx to $img=screen_image_picker"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh face property"
        //% weight=9
        public setFaceImage(idx: number, img: Image) {
            if (this.faces[idx].img.equals(img)) return;
            this.faces[idx].img = img
        }

        //% blockid=poly_clearfaceimage
        //% block=" $this clear face image at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh face property"
        //% weight=8
        public clearFaceImage(idx: number) {
            if (!this.faces[idx].img) return;
            delete this.faces[idx].img
        }

        //% blockid=poly_mesh_pivot_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=10
        public setPivot(choice: PivotPos, x: number) {
            switch(choice) {
                case 0: this.pivot.x = x; break
                case 1: this.pivot.y = x; break
                case 2: this.pivot.z = x; break
            }
        }

        //% blockid=poly_mesh_pivot_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=5
        public changePivot(choice: PivotPos, x: number) {
            switch (choice) {
                case 0: this.pivot.x += x; break
                case 1: this.pivot.y += x; break
                case 2: this.pivot.z += x; break
            }
        }

        //% blockid=poly_mesh_pivot_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=4
        public getPivot(choice: PivotPos) {
            switch (choice) {
                case 0: return this.pivot.x
                case 1: return this.pivot.y
                case 2: return this.pivot.z
            }
            return NaN
        }

        //% blockid=poly_mesh_rot_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=100
        public setAngle(choice: Angles, x: number) {
            switch (choice) {
                case 0: this.rot.x = x; break
                case 1: this.rot.y = x; break
                case 2: this.rot.z = x; break
            }
        }

        //% blockid=poly_mesh_rot_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=5
        public changeAngle(choice: Angles, x: number) {
            switch (choice) {
                case 0: this.rot.x += x; break
                case 1: this.rot.y += x; break
                case 2: this.rot.z += x; break
            }
        }

        //% blockid=poly_mesh_rot_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=4
        public getAngle(choice: Angles) {
            switch (choice) {
                case 0: return this.rot.x
                case 1: return this.rot.y
                case 2: return this.rot.z
            }
            return NaN
        }

        //% blockid=poly_mesh_pos_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh position property"
        //% weight=10
        public setPos(choice: PointProp, x: number) {
            switch (choice) {
                case 0: this.pos.x = x; break
                case 1: this.pos.y = x; break
                case 2: this.pos.z = x; break
                case 3: this.pos.vx = x; break
                case 4: this.pos.vy = x; break
                case 5: this.pos.vz = x; break
            }
        }

        //% blockid=poly_mesh_pos_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh position property"
        //% weight=9
        public changePos(choice: PointProp, x: number) {
            switch (choice) {
                case 0: this.pos.x += x; break
                case 1: this.pos.y += x; break
                case 2: this.pos.z += x; break
                case 3: this.pos.vx += x; break
                case 4: this.pos.vy += x; break
                case 5: this.pos.vz += x; break
            }
        }

        //% blockid=poly_mesh_pos_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh position property"
        //% weight=8
        public getPos(choice: PointProp) {
            switch (choice) {
                case 0: return this.pos.x
                case 1: return this.pos.y
                case 2: return this.pos.z
                case 3: return this.pos.vx
                case 4: return this.pos.vy
                case 5: return this.pos.vz
            }
            return NaN
        }

    }

    let ax = 0, az = 0, ay = 0
    let camx = 0, camy = 0, camz = 0
    let zoom = 1, sort = 0, dist = 150

    function rotatePoint3D(point: { x: number, y: number, z: number }, pivot: { x: number, y: number, z: number }, angle: { x: number, y: number, z: number }) {

        // move point with pivot to 1st place
        let dx = point.x - pivot.x;
        let dy = point.y - pivot.y;
        let dz = point.z - pivot.z;

        // --- rotate around x ---
        let dy1 = dy * Math.cos(angle.x) - dz * Math.sin(angle.x);
        let dz1 = dy * Math.sin(angle.x) + dz * Math.cos(angle.x);
        dy = dy1;
        dz = dz1;

        // --- rotate around y ---
        let dx1 = dx * Math.cos(angle.y) + dz * Math.sin(angle.y);
        dz1 = -dx * Math.sin(angle.y) + dz * Math.cos(angle.y);
        dx = dx1;
        dz = dz1;

        // --- rotate around z ---
        dx1 = dx * Math.cos(angle.z) - dy * Math.sin(angle.z);
        dy1 = dx * Math.sin(angle.z) + dy * Math.cos(angle.z);
        dx = dx1;
        dy = dy1;

        // move back to real position
        return {
            x: dx + pivot.x,
            y: dy + pivot.y,
            z: dz + pivot.z
        };
    }

    //% blockid=poly_rendermesh_all
    //% block=" $plms render all meshes to $image=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% plms.shadow=variables_get plms.defl=myMeshes
    //% group="render"
    //% weight=9
    export function renderAll(plms: mesh[], image: Image, linecolor?: number) {
        if (!plms || !image || plms.length <= 0) return;

        const depths = plms.map(plm => meshDepthZ(plm));
        const sorted = plms.map((m, i) => ({ mesh: m, depth: depths[i] }));
        switch (sort) {
            case 0: sorted.sort((a, b) => b.depth - a.depth); break
            case 1: introSort(sorted, (a, b) => b.depth - a.depth); break
        }
        for (const m of sorted) if (!m.mesh.flag.invisible) render(m.mesh, image, linecolor);
    }

    //% blockid=poly_rendermesh
    //% block=" $plm render to $image=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% plm.shadow=variables_get plm.defl=myMesh
    //% group="render"
    //% weight=10
    export function render(plm: mesh, image: Image, linecolor?: number) {
        if (!plm || !image || plm.points.length <= 0 || plm.faces.length <= 0) return;
        if (plm.flag.invisible) return;

        const centerX = image.width >> 1;
        const centerY = image.height >> 1;

        const cosX = Math.cos(ax), sinX = Math.sin(ax);
        const cosY = Math.cos(ay), sinY = Math.sin(ay);
        const cosZ = Math.cos(az), sinZ = Math.sin(az);

        // Transform vertices
        const rotated = plm.points.map(v => {
            const vpoint: { x: number, y: number, z: number } = { x: plm.pos.x + v.x, y: plm.pos.y + v.y, z: plm.pos.z + v.z}
            const vpivot: { x: number, y: number, z: number } = { x: plm.pos.x + plm.pivot.x, y: plm.pos.y + plm.pivot.y, z: plm.pos.z + plm.pivot.z }
            const vpos: {x: number, y: number, z: number} = rotatePoint3D(vpoint, vpivot, plm.rot)
            // camera offset
            let x = vpos.x - camx;
            let y = vpos.y - camy;
            let z = vpos.z - camz;

            // rotate camera
            let tx = x * cosY + z * sinY;
            z = -x * sinY + z * cosY;
            x = tx;

            let ty = y * cosX - z * sinX;
            z = y * sinX + z * cosX;
            y = ty;

            tx = x * cosZ - y * sinZ;
            y = x * sinZ + y * cosZ;
            x = tx;

            // Perspective
            const scale = Math.abs(dist) / (Math.abs(dist) + z);
            return {
                x: centerX + x * scale * zoom,
                y: centerY + y * scale * zoom,
                z: z
            };
        })

        // Sort triangles
        const tris = plm.faces.slice();
        switch (sort) {
            case 0: tris.sort((a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break
            case 1: default: introSort(tris, (a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break
        }
        
        // Render
        for (const t of tris) {
            const inds = t.indices;
            if (inds.some(i => rotated[i].z < -Math.abs(dist))) continue;
            if (inds.every(i => (isOutOfArea(rotated[i].x, rotated[i].y, image.width, image.height)))) continue;
            
            // Backface culling
            if (!plm.flag.noncull) if (isFaceVisible(rotated, inds, plm.flag.backface)) continue;

            // Draw line canvas when have line color index
            if (linecolor && linecolor > 0) {
                helpers.imageDrawLine(image, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[1]].x, rotated[inds[1]].y, linecolor);
                if (inds.length < 3) continue;
                helpers.imageDrawLine(image, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                if (inds.length > 3) helpers.imageDrawLine(image, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[1]].x, rotated[inds[1]].y, linecolor), helpers.imageDrawLine(image, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                else helpers.imageDrawLine(image, rotated[inds[1]].x, rotated[inds[1]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                continue;
            }
            
            // Draw line when no shape
            helpers.imageDrawLine(
                image,
                rotated[inds[0]].x, rotated[inds[0]].y,
                rotated[inds[1]].x, rotated[inds[1]].y,
                t.color
            );
            // Draw solid when is vertice shape
            if (inds.length > 2) {
                helpers.imageFillTriangle(
                    image,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    t.color
                );
            }
            if (inds.length > 3) {
                helpers.imageFillTriangle(
                    image,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    t.color
                );
            }

            // Draw texture over
            if (t.img && inds.length === 4) {
                distortImage(t.img.clone(), image,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    rotated[inds[3]].x, rotated[inds[3]].y
                );
            }

        }
        
    }

    function isOutOfArea(x: number, y: number, width: number, height: number) {
        return isOutOfRange(x, width) || isOutOfRange(y, height)
    }

    function isOutOfRange(x: number, range: number) {
        return x < 0 || x >= range
    }

    function isFaceVisible(rotated: { z: number }[], indices: number[], inner?: boolean): boolean {
        // Simple normal calculation for culling
        if (indices.length > 0) {
            const zs = indices.map(ind => rotated[ind].z)

            // Average depth comparison
            const avgZ = zs.reduce((sum, z) => sum + z, 0) / zs.length;
            const otherZs = rotated.filter((_, i) => indices.indexOf(i) < 0).map(p => p.z);

            if (otherZs.length > 0) {
                const otherAvg = otherZs.reduce((sum, z) => sum + z, 0) / otherZs.length;
                return inner ? avgZ < otherAvg : avgZ > otherAvg;
            }
        }
        return true;
    }

    function meshDepthZ(plm: mesh): number {
        let x = plm.pos.x - camx;
        let y = plm.pos.y - camy;
        let z = plm.pos.z - camz;

        // rotate camera
        let tx = x * Math.cos(ay) + z * Math.sin(ay);
        z = -x * Math.sin(ay) + z * Math.cos(ay);
        x = tx;

        let ty = y * Math.cos(ax) - z * Math.sin(ax);
        z = y * Math.sin(ax) + z * Math.cos(ax);
        y = ty;

        tx = x * Math.cos(az) - y * Math.sin(az);
        y = x * Math.sin(az) + y * Math.cos(az);
        x = tx;

        return z;
    }

    export function introSort<T>(
        arr: T[],
        compare: (a: T, b: T) => number
    ): void {
        const maxDepth = 2 * Math.floor(Math.log(arr.length) / Math.log(2));
        introsortUtil(arr, 0, arr.length - 1, maxDepth, compare);
    }

    function introsortUtil<T>(
        arr: T[],
        start: number,
        end: number,
        depthLimit: number,
        compare: (a: T, b: T) => number
    ): void {
        const size = end - start + 1;
        if (size <= 16) { insertionSort(arr, start, end, compare);
        return; }

        if (depthLimit === 0) { heapSort(arr, start, end, compare);
        return; }

        const pivot = medianOfThree(arr, start, start + ((end - start) >> 1), end, compare);
        const p = partition(arr, start, end, pivot, compare);
        introsortUtil(arr, start, p - 1, depthLimit - 1, compare);
        introsortUtil(arr, p + 1, end, depthLimit - 1, compare);
    }

    function insertionSort<T>(arr: T[], start: number, end: number, compare: (a: T, b: T) => number) {
        for (let i = start + 1; i <= end; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= start && compare(arr[j], key) > 0) arr[j + 1] = arr[j], j--;
            arr[j + 1] = key;
        }
    }

    function heapSort<T>(arr: T[], start: number, end: number, compare: (a: T, b: T) => number) {
        const size = end - start + 1;

        function siftDown(i: number, max: number) {
            let largest = i;
            while (true) {
                const left = 2 * i + 1, right = 2 * i + 2;
                if (left < max && compare(arr[start + left], arr[start + largest]) > 0) largest = left;
                if (right < max && compare(arr[start + right], arr[start + largest]) > 0) largest = right;
                if (largest === i) break;
                [arr[start + i], arr[start + largest]] = [arr[start + largest], arr[start + i]]
                i = largest, largest = i;
            }
        }

        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) siftDown(i, size);

        for (let i = size - 1; i > 0; i--) [arr[start], arr[start + i]] = [arr[start + i], arr[start]], siftDown(0, i);
    }

    function partition<T>(
        arr: T[],
        low: number,
        high: number,
        pivot: T,
        compare: (a: T, b: T) => number
    ): number {
        while (low <= high) {
            while (compare(arr[low], pivot) < 0) low++;
            while (compare(arr[high], pivot) > 0) high--;
            if (low <= high) [arr[low], arr[high]] = [arr[high], arr[low]], low++, high--;
        }
        return low;
    }

    function medianOfThree<T>(
        arr: T[],
        a: number,
        b: number,
        c: number,
        compare: (a: T, b: T) => number
    ): T {
        if (compare(arr[a], arr[b]) < 0) {
            if (compare(arr[b], arr[c]) < 0) return arr[b];
            else if (compare(arr[a], arr[c]) < 0) return arr[c];
            else return arr[a];
        } else {
            if (compare(arr[a], arr[c]) < 0) return arr[a];
            else if (compare(arr[b], arr[c]) < 0) return arr[c];
            else return arr[b];
        }
    }

    function avgZ(rot: { z: number }[], inds: number[]): number {
        return inds.reduce((s, i) => s + rot[i].z, 0) / inds.length;
    }

    function distortImage(src: Image, dest: Image,
        X1: number, Y1: number, X2: number, Y2: number,
        X3: number, Y3: number, X4: number, Y4: number) {
        for (let y = 0; y < src.height; y++) {
            for (let x = 0; x < src.width; x++) {
                const col = src.getPixel(src.width - x, src.height - y);
                if (!col || col <= 0) continue;
                const sx = (s: number, m?: boolean) => Math.trunc((1 - ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s)) * (X1 + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (X2 - X1)) + ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s) * (X3 + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (X4 - X3)))
                const sy = (s: number, m?: boolean) => Math.trunc((1 - ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s)) * (Y1 + ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s) * (Y3 - Y1)) + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (Y2 + ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s) * (Y4 - Y2)))
                if (isOutOfArea(sx(zoom), sy(zoom), dest.width, dest.height) || isOutOfArea(sx(zoom, true), sy(zoom, true), dest.width, dest.height)) continue;
                helpers.imageFillTriangle(dest, sx(zoom, true), sy(zoom), sx(zoom), sy(zoom), sx(zoom, true), sy(zoom, true), col)
                helpers.imageFillTriangle(dest, sx(zoom), sy(zoom, true), sx(zoom), sy(zoom), sx(zoom, true), sy(zoom, true), col)
            }
        }
    }

    //% blockid=poly_angle_change
    //% block="change $choice by $x"
    //% group="main angle"
    //% weight=5
    export function changeAngle(choice: Angles, x: number) {
        switch (choice) {
            case 0: ax += x; break
            case 1: ay += x; break
            case 2: az += x; break
        }
    }
    //% blockid=poly_camera_change
    //% block="change $choice by $x"
    //% group="main camera"
    //% weight=5
    export function changeCam(choice: Cameras, x: number) {
        switch (choice) {
            case 0: camx += x; break
            case 1: camy += x; break
            case 2: camz += x; break
            case 3: default: zoom += x; break
            case 4: dist += x; break
        }
    }
    //% blockid=poly_angle_set
    //% block="set $choice to $x"
    //% group="main angle"
    //% weight=10
    export function setAngle(choice: Angles, x: number) {
        switch (choice) {
            case 0: ax = x; break
            case 1: ay = x; break
            case 2: az = x; break
        }
    }
    //% blockid=poly_camera_set
    //% block="set $choice to $x"
    //% group="main camera"
    //% weight=10
    export function setCam(choice: Cameras, x: number) {
        switch (choice) {
            case 0: camx = x; break
            case 1: camy = x; break
            case 2: camz = x; break
            case 3: default: zoom = x; break
            case 4: dist = x; break
        }
    }

    //% blockid=poly_angle_get
    //% block="$choice"
    //% group="main angle"
    //% weight=4
    export function getAngle(choice: Angles) {
        switch (choice) {
            case 0: return ax
            case 1: return ay
            case 2: return az
        }
        return NaN
    }

    //% blockid=poly_camera_get
    //% block="$choice"
    //% group="main camera"
    //% weight=4
    export function getCam(choice: Cameras) {
        switch (choice) {
            case 0: return camx
            case 1: return camy
            case 2: return camz
            case 3: default: return zoom
            case 4: return dist
        }
        return NaN
    }

    //% blockid=poly_camera_setpos
    //% block="set camera position to x: $x y: $y z: $z"
    //% group="main camera"
    //% weight=3
    export function setCamPosition(x: number, y: number, z: number) { [camx, camy, camz] = [x, y, z] }

}