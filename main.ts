
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

    //% blockid=poly_newmesh
    //% block="create new mesh"
    //% blockSetVariable=myMesh
    //% group="create"
    //% weight=10
    export function newmesh() { return new mesh() }

    export class mesh {
        cts: { indices: number[], color: number, img?: Image }[]
        cvs: { x: number, y: number, z: number }[]
        pivot: { ox: number, oy: number, oz: number}
        rot: { rx: number, ry: number, rz: number }

        constructor() {
            this.cts = [{ indices: [0, 0, 0], color: 0, img: null }]
            this.cvs = [{ x: 0, y: 0, z: 0 }]
            this.pivot = { ox: 0, oy: 0, oz: 0 }
            this.rot = { rx: 0, ry: 0, rz: 0 }
        }

        //% blockid=poly_addvertice
        //% block=" $this set vertice at $idx by x: $x y: $y z: $z"
        //% this.shadow=variables_get this.defl=myMesh
        //% ccv.shadow=poly_shadow_vertice
        //% group="mesh property"
        //% weight=10
        public setVertice(idx: number, x: number, y: number, z: number) { this.cvs[idx] = { x: x, y: y, z: z } }

        //% blockid=poly_addtriangle
        //% block=" $this set triangle in color $c=colorindexpicker at $idx by idc1 $i1 idc2 $i2 idc3 $i3|| idc4 $i4 and texture $img=screen_image_picker"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=9
        public setTriangle(idx: number, c: number, i1: number, i2: number, i3: number, i4?: number, img?: Image) {
            let indice = [i1, i2, i3]
            if (i4) indice.push(i4)
            if (i4 && img) this.cts[idx] = { indices: indice, color: c, img: img }
            else this.cts[idx] = { indices: indice, color: c }
        }

        //% blockid=poly_delvertice
        //% block=" $this remove vertice at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh remover"
        //% weight=8
        public delVertice(idx: number) { this.cvs.removeAt(idx) }

        //% blockid=poly_deltriangle
        //% block=" $this remove triangle at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh remover"
        //% weight=7
        public delTriangle(idx: number) { this.cts.removeAt(idx) }

        //% blockid=poly_mesh_pos_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=10
        public setPivot(choice: PivotPos, x: number) {
            switch(choice) {
                case 0: this.pivot.ox = x; break
                case 1: this.pivot.oy = x; break
                case 2: this.pivot.oz = x; break
            }
        }

        //% blockid=poly_mesh_pos_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=5
        public changePivot(choice: PivotPos, x: number) {
            switch (choice) {
                case 0: this.pivot.ox += x; break
                case 1: this.pivot.oy += x; break
                case 2: this.pivot.oz += x; break
            }
        }

        //% blockid=poly_mesh_pos_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh pivot"
        //% weight=4
        public getPivot(choice: PivotPos) {
            switch (choice) {
                case 0: return this.pivot.ox
                case 1: return this.pivot.oy
                case 2: return this.pivot.oz
            }
            return 0
        }

        //% blockid=poly_mesh_rot_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=100
        public setAngle(choice: Angles, x: number) {
            switch (choice) {
                case 0: this.rot.rx = x; break
                case 1: this.rot.ry = x; break
                case 2: this.rot.rz = x; break
            }
        }

        //% blockid=poly_mesh_rot_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=5
        public changeAngle(choice: Angles, x: number) {
            switch (choice) {
                case 0: this.rot.rx += x; break
                case 1: this.rot.ry += x; break
                case 2: this.rot.rz += x; break
            }
        }

        //% blockid=poly_mesh_rot_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=4
        public getAngle(choice: Angles) {
            switch (choice) {
                case 0: return this.rot.rx
                case 1: return this.rot.ry
                case 2: return this.rot.rz
            }
            return 0
        }

    }

    let ax = 0, az = 0, ay = 0
    let camx = 0, camy = 0, camz = 0
    let zoom = 1, sort = 0

    //% blockid=poly_rendermesh
    //% block=" $mymesh render to $image=screen_image_picker|| as inner? $inner=toggleYesNo and debug color? $debug=colorindexpicker"
    //% mymesh.shadow=variables_get mymesh.defl=myMesh
    //% group="render"
    //% weight=10
    export function render(mymesh: mesh, image: Image, inner?: boolean, debug?: number) {
        const centerX = image.width >> 1;
        const centerY = image.height >> 1;

        const cosX = Math.cos(ax), sinX = Math.sin(ax);
        const cosY = Math.cos(ay), sinY = Math.sin(ay);
        const cosZ = Math.cos(az), sinZ = Math.sin(az);

        const crx = Math.cos(mymesh.rot.rx), srx = Math.sin(mymesh.rot.rx);
        const cry = Math.cos(mymesh.rot.ry), sry = Math.sin(mymesh.rot.ry);
        const crz = Math.cos(mymesh.rot.rz), srz = Math.sin(mymesh.rot.rz);

        // Transform vertices
        const rotated = mymesh.cvs.map(v => {
            // กล้อง offset
            let x = v.x - camx;
            let y = v.y - camy;
            let z = v.z - camz;

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

            x -= mymesh.pivot.ox;
            y -= mymesh.pivot.oy;
            z -= mymesh.pivot.oz;

            // rotate mymesh
            tx = x * cry + z * sry;
            z = -x * sry + z * cry;
            x = tx;

            ty = y * crx - z * srx;
            z = y * srx + z * crx;
            y = ty;

            tx = x * crz - y * srz;
            y = x * srz + y * crz;
            x = tx;

            // Perspective
            const dist = 150;
            const scale = dist / (dist + z);
            return {
                x: centerX + x * scale * zoom,
                y: centerY + y * scale * zoom,
                z: z
            };
        })

        // Sort triangles
        const tris = mymesh.cts.slice();
        switch (sort) {
            case 0: tris.sort((a, b) => avgZ(rotated, b.indices) - avgZ(rotated, a.indices)); break
            case 1: default: introSort(tris, rotated); break
        }
        // Render
        let pic: Image, pici: Image
        for (const t of tris) {
            const inds = t.indices;
            if (inds.some(i => rotated[i].z < -150)) continue;
            if (inds.every(i => (rotated[i].x < 0 || rotated[i].x >= image.width) || (rotated[i].y < 0 || rotated[i].y >= image.height))) continue;

            const depthCheck = rotated.some((ro) => ((inner ? inds.every(i => rotated[i].z > ro.z) : inds.every(i => rotated[i].z < ro.z)) || inds.every(i => Math.round(rotated[i].z) == Math.round(ro.z))))
            if (!depthCheck) continue;

            // Draw solid
            helpers.imageFillTriangle(
                image,
                rotated[inds[0]].x, rotated[inds[0]].y,
                rotated[inds[1]].x, rotated[inds[1]].y,
                rotated[inds[2]].x, rotated[inds[2]].y,
                t.color
            );
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
        // Draw debug canvas
        if (debug && debug > 0) {
            for (const t of tris) {
                const inds = t.indices;
                helpers.imageDrawLine(image, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[1]].x, rotated[inds[1]].y, debug);
                helpers.imageDrawLine(image, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[2]].x, rotated[inds[2]].y, debug);
                helpers.imageDrawLine(image, rotated[inds[1]].x, rotated[inds[1]].y, rotated[inds[2]].x, rotated[inds[2]].y, debug);
                if (inds.length < 4) continue;
                helpers.imageDrawLine(image, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[1]].x, rotated[inds[1]].y, debug);
                helpers.imageDrawLine(image, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[2]].x, rotated[inds[2]].y, debug);
            }
        }
    }

    function introSort(arr: { indices: number[] }[], rot: { z: number }[]) {
        const maxDepth = 2 * Math.ceil(Math.log(arr.length) / Math.log(2));
        introsortUtil(arr, 0, arr.length - 1, maxDepth, rot);
    }

    function introsortUtil(arr: { indices: number[] }[], start: number, end: number, depthLimit: number, rot: { z: number }[]) {
        const size = end - start + 1;

        if (size < 16) {
            insertionSort(arr, start, end, rot);
            return;
        }

        if (depthLimit === 0) {
            heapSort(arr, start, end, rot);
            return;
        }

        const pivot = partitionIntro(arr, start, end, avgZ(rot, arr[start + ((end - start) >> 1)].indices), rot);
        introsortUtil(arr, start, pivot - 1, depthLimit - 1, rot);
        introsortUtil(arr, pivot, end, depthLimit - 1, rot);
    }

    function insertionSort(arr: { indices: number[] }[], start: number, end: number, rot: { z: number }[]) {
        for (let i = start + 1; i <= end; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= start && avgZ(rot, arr[j].indices) < avgZ(rot, key.indices)) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    function heapSort(arr: { indices: number[] }[], start: number, end: number, rot: { z: number }[]) {
        const heapSize = end - start + 1;

        for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
            heapify(arr, heapSize, i, start, rot);
        }

        for (let i = heapSize - 1; i > 0; i--) {
            const tmp = arr[start];
            arr[start] = arr[start + i];
            arr[start + i] = tmp;
            heapify(arr, i, 0, start, rot);
        }
    }

    function heapify(arr: { indices: number[] }[], size: number, root: number, offset: number, rot: { z: number }[]) {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        if (left < size && avgZ(rot, arr[offset + left].indices) > avgZ(rot, arr[offset + largest].indices)) {
            largest = left;
        }
        if (right < size && avgZ(rot, arr[offset + right].indices) > avgZ(rot, arr[offset + largest].indices)) {
            largest = right;
        }
        if (largest !== root) {
            const tmp = arr[offset + root];
            arr[offset + root] = arr[offset + largest];
            arr[offset + largest] = tmp;
            heapify(arr, size, largest, offset, rot);
        }
    }

    function partitionIntro(arr: { indices: number[] }[], left: number, right: number, pivot: number, rot: { z: number }[]) {
        while (left <= right) {
            while (avgZ(rot, arr[left].indices) > pivot) left++;
            while (avgZ(rot, arr[right].indices) < pivot) right--;
            if (left <= right) {
                const tmp = arr[left];
                arr[left] = arr[right];
                arr[right] = tmp;
                left++;
                right--;
            }
        }
        return left;
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
                if (col && col > 0) {
                    const sx = (s: number, m?: boolean) => Math.trunc((1 - ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s)) * (X1 + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (X2 - X1)) + ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s) * (X3 + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (X4 - X3)))
                    const sy = (s: number, m?: boolean) => Math.trunc((1 - ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s)) * (Y1 + ((y * s) + (m ? s : 0) - (s / 2)) / (src.height * s) * (Y3 - Y1)) + ((x * s) + (m ? s : 0) - (s / 2)) / (src.width * s) * (Y2 + ((y * s) + (m ? s : 0) - (s / 2))  / (src.height * s) * (Y4 - Y2)))
                    helpers.imageFillPolygon4(dest, sx(zoom), sy(zoom), sx(zoom, true), sy(zoom), sx(zoom), sy(zoom, true), sx(zoom, true), sy(zoom, true), col)
                }
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
        }
    }

    //% blockid=poly_sorttype
    //% block="set sorting method to $method"
    //% group="sorting"
    //% weight=10
    export function sortingMethod(method: SortingMethods) {
        sort = method
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
        return 0
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
        }
        return 0
    }

    //% blockid=poly_camera_setpos
    //% block="set camera position to x: $x y: $y z: $z"
    //% group="main camera"
    //% weight=3
    export function setcCampos(x: number, y: number, z: number) {
        camx = x, camy = y, camz = z
    }

}
