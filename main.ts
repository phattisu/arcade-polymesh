
//% block="Poly mesh" color="#279139" icon="\uf1b2" groups='["Create","Controls","Styling"]'
namespace Polymesh {

    const inProcess: boolean[] = [false, false]

    export enum Angles {
        //% block="Angle x"
        x = 0,
        //% block="Angle y"
        y = 1,
        //% block="Angle z"
        z = 2,
        //% block="Angle vx"
        vx = 3,
        //% block="Angle vy"
        vy = 4,
        //% block="Angle vz"
        vz = 5,
    }
    export enum Cameras {
        //% block="Camera zoom"
        zoom = 0,
        //% block="Camera distance"
        dist = 1,
        //% block="Camera x"
        x = 2,
        //% block="Camera y"
        y = 3,
        //% block="Camera z"
        z = 4,
        //% block="Camera vx"
        vx = 5,
        //% block="Camera vy"
        vy = 6,
        //% block="Camera vz"
        vz = 7,
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
        x = 0,
        //% block="Pivot y"
        y = 1,
        //% block="Pivot z"
        z = 2,
    }
    export enum SortingMethods {
        //% block="accurate"
        accurate = 0,
        //% block="quick"
        quick = 1,
    }
    export enum MeshFlags {
        //% block="Invisible"
        invisible = 0,
        //% block="Non culling"
        noncull = 1,
        //% block="Back face"
        backface = 2,
    }

    /** Fast inverse square root **/
    function fastInverseSquareRoot(x: number): number {
        if (x <= 0) return 0;
        const buf = pins.createBuffer(4);
        buf.setNumber(NumberFormat.Float32LE, 0, x);
        let i = buf.getNumber(NumberFormat.Int32LE, 0);
        i = 0x5f3759df - (i >> 1);
        buf.setNumber(NumberFormat.Int32LE, 0, i);
        let y = buf.getNumber(NumberFormat.Float32LE, 0);
        // One iteration Newton-Raphson
        y = y * (1.5 - (0.5 * x * y * y));
        return y;
    }

    let ax = 0, az = 0, ay = 0, avx = 0, avy = 0, avz = 0
    let camx = 0, camy = 0, camz = 0, camvx = 0, camvy = 0, camvz = 0
    let zoom = 1, sort = 0, dist = 150

    forever(() => {
        const deltaG = control.eventContext().deltaTime

        // Velocity angle of camera
        if (avx !== 0) ax += avx * deltaG
        if (avy !== 0) ay += avy * deltaG
        if (avz !== 0) az += avz * deltaG

        // Velocity position of camera
        if (camvx !== 0) camx += camvx * deltaG
        if (camvy !== 0) camy += camvy * deltaG
        if (camvz !== 0) camz += camvz * deltaG
    })

    //% blockId=poly_angle_change
    //% block="change $choice by $x"
    //% group="main angle"
    //% weight=5
    export function changeAngle(choice: Angles, x: number) {
        switch (choice) {
            case 0: ax += x; break
            case 1: ay += x; break
            case 2: az += x; break
            case 3: avx += x; break
            case 4: avy += x; break
            case 5: avz += x; break
        }
    }
    //% blockId=poly_camera_change
    //% block="change $choice by $x"
    //% group="main camera"
    //% weight=5
    export function changeCam(choice: Cameras, x: number) {
        switch (choice) {
            case 0: default: zoom += x; break
            case 1: dist += x; break
            case 2: camx += x; break
            case 3: camy += x; break
            case 4: camz += x; break
            case 5: camvx += x; break
            case 6: camvy += x; break
            case 7: camvz += x; break
        }
    }
    //% blockId=poly_angle_set
    //% block="set $choice to $x"
    //% group="main angle"
    //% weight=10
    export function setAngle(choice: Angles, x: number) {
        switch (choice) {
            case 0: ax = x; break
            case 1: ay = x; break
            case 2: az = x; break
            case 3: avx = x; break
            case 4: avy = x; break
            case 5: avz = x; break
        }
    }
    //% blockId=poly_camera_set
    //% block="set $choice to $x"
    //% group="main camera"
    //% weight=10
    export function setCam(choice: Cameras, x: number) {
        switch (choice) {
            case 0: default: zoom = x; break
            case 1: dist = x; break
            case 2: camx = x; break
            case 3: camy = x; break
            case 4: camz = x; break
            case 5: camvx = x; break
            case 6: camvy = x; break
            case 7: camvz = x; break
        }
    }

    //% blockId=poly_angle_get
    //% block="$choice"
    //% group="main angle"
    //% weight=4
    export function getAngle(choice: Angles) {
        switch (choice) {
            case 0: return ax
            case 1: return ay
            case 2: return az
            case 3: return avx
            case 4: return avy
            case 5: return avz
        }
        return NaN
    }

    //% blockId=poly_camera_get
    //% block="$choice"
    //% group="main camera"
    //% weight=4
    export function getCam(choice: Cameras) {
        switch (choice) {
            case 0: default: return zoom
            case 1: return dist
            case 2: return camx
            case 3: return camy
            case 4: return camz
            case 5: return camvx
            case 6: return camvy
            case 7: return camvz
        }
        return NaN
    }

    //% blockId=poly_camera_setpos
    //% block="set camera position to x: $x y: $y z: $z"
    //% group="main camera"
    //% weight=3
    export function setCamPosition(x: number, y: number, z: number) { [camx, camy, camz] = [x, y, z] }

    //% blockId=poly_sorttype
    //% block="set sorting method to $method"
    //% group="sorting"
    //% weight=10
    export function sortingMethod(method: SortingMethods) {
        sort = method
    }

    //% blockId=poly_newmesh
    //% block="create new mesh"
    //% blockSetVariable=myMesh
    //% group="create"
    //% weight=10
    export function newmesh() { return new mesh() }

    export class mesh {
        public faces: { indices: number[], color: number, img?: Image}[]
        public points: { x: number, y: number, z: number }[]
        public pivot: { x: number, y: number, z: number}
        public rot: { x: number, y: number, z: number, vx: number, vy: number, vz: number }
        public pos: { x: number, y: number, z: number, vx: number, vy: number, vz: number }
        flag: { invisible: boolean, noncull: boolean, backface: boolean}
        __home__() {
            forever(() => {
                const delta = control.eventContext().deltaTime

                // Velocity angle of this mesh
                if (this.rot.vx !== 0) this.rot.x += this.rot.vx * delta;
                if (this.rot.vy !== 0) this.rot.y += this.rot.vy * delta;
                if (this.rot.vz !== 0) this.rot.z += this.rot.vz * delta;

                // Velocity position of this mesh
                if (this.pos.vx !== 0) this.pos.x += this.pos.vx * delta;
                if (this.pos.vy !== 0) this.pos.y += this.pos.vy * delta;
                if (this.pos.vz !== 0) this.pos.z += this.pos.vz * delta;
            })
        }

        constructor() {
            this.faces = []
            this.points = []
            this.pivot = { x: 0, y: 0, z: 0 }
            this.rot = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
            this.pos = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
            this.flag = { invisible: false, noncull: false, backface: false }

            this.__home__()
        }

        //% blockId=poly_flag_set
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

        //% blockId=poly_flag_get
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

        //% blockId=poly_vertice_set
        //% block=" $this set vertice at $idx to $point3"
        //% point3.shadow=poly_shadow_point3
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=10
        public setVertice(idx: number, point3: shadowPoint3) { this.points[idx] = { x: point3.x, y: point3.y, z: point3.z } }

        //% blockId=poly_vertice_add
        //% block=" $this add vertice to $point3"
        //% point3.shadow=poly_shadow_point3
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=9
        public addVertice(point3: shadowPoint3) { this.points.push({ x: point3.x, y: point3.y, z: point3.z }) }

        //% blockId=poly_vertice_del
        //% block=" $this remove vertice|| at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh remover"
        //% weight=10
        public delVertice(idx?: number) {
            if (idx) this.points.removeAt(idx);
            else this.points.pop();
        }

        //% blockId=poly_face_set
        //% block=" $this set face at $idx to color $c=colorindexpicker and $inds|| and texture $img=screen_image_picker"
        //% inds.shadow=poly_shadow_indices
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=8
        public setFace(idx: number, c: number, inds: shadowIndices, img?: Image) {
            const indice = [inds.i1]
            if (inds.i2) indice.push(inds.i2);
            if (inds.i3) indice.push(inds.i3);
            if (inds.i4) indice.push(inds.i4);
            if (img) this.faces[idx] = { indices: indice, color: c, img: img };
            else this.faces[idx] = { indices: indice, color: c };
        }

        //% blockId=poly_face_add
        //% block=" $this add face to color $c=colorindexpicker and $inds|| and texture $img=screen_image_picker"
        //% inds.shadow=poly_shadow_indices
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh property"
        //% weight=7
        public addFace(c: number, inds: shadowIndices, img?: Image) {
            const indice = [inds.i1]
            if (inds.i2) indice.push(inds.i2);
            if (inds.i3) indice.push(inds.i3);
            if (inds.i4) indice.push(inds.i4);
            if (img) this.faces.push({ indices: indice, color: c, img: img });
            else this.faces.push({ indices: indice, color: c });
        }

        //% blockId=poly_face_del
        //% block=" $this remove face|| at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh remover"
        //% weight=9
        public delFace(idx?: number) {
            if (idx) this.faces.removeAt(idx);
            else this.faces.pop();
        }

        //% blockId=poly_setfacecolor
        //% block=" $this set face color at $idx to $c=colorindexpicker"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh face property"
        //% weight=10
        public setFaceColor(idx: number, c: number) {
            if (this.faces[idx].color === c) return;
            this.faces[idx].color = c
        }

        //% blockId=poly_setfaceimage
        //% block=" $this set face image at $idx to $img=screen_image_picker"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh face property"
        //% weight=9
        public setFaceImage(idx: number, img: Image) {
            if ((this.faces[idx].img as Image).equals(img)) return;
            this.faces[idx].img = img
        }

        //% blockId=poly_clearfaceimage
        //% block=" $this clear face image at $idx"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh face property"
        //% weight=8
        public clearFaceImage(idx: number) {
            if (!this.faces[idx].img) return;
            delete this.faces[idx].img
        }

        //% blockId=poly_mesh_pivot_set
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

        //% blockId=poly_mesh_pivot_change
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

        //% blockId=poly_mesh_pivot_get
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

        //% blockId=poly_mesh_rot_set
        //% block=" $this set $choice to $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=100
        public setAngle(choice: Angles, x: number) {
            switch (choice) {
                case 0: this.rot.x = x; break
                case 1: this.rot.y = x; break
                case 2: this.rot.z = x; break
                case 3: this.rot.vx = x; break
                case 4: this.rot.vy = x; break
                case 5: this.rot.vz = x; break
            }
        }

        //% blockId=poly_mesh_rot_change
        //% block=" $this change $choice by $x"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=5
        public changeAngle(choice: Angles, x: number) {
            switch (choice) {
                case 0: this.rot.x += x; break
                case 1: this.rot.y += x; break
                case 2: this.rot.z += x; break
                case 3: this.rot.vx += x; break
                case 4: this.rot.vy += x; break
                case 5: this.rot.vz += x; break
            }
        }

        //% blockId=poly_mesh_rot_get
        //% block=" $this get $choice"
        //% this.shadow=variables_get this.defl=myMesh
        //% group="mesh angle"
        //% weight=4
        public getAngle(choice: Angles) {
            switch (choice) {
                case 0: return this.rot.x
                case 1: return this.rot.y
                case 2: return this.rot.z
                case 3: return this.rot.vx
                case 4: return this.rot.vy
                case 5: return this.rot.vz
            }
            return NaN
        }

        //% blockId=poly_mesh_pos_set
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

        //% blockId=poly_mesh_pos_change
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

        //% blockId=poly_mesh_pos_get
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

    //% blockId=poly_rendermesh_all
    //% block=" $plms render all meshes to $output=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% plms.shadow=variables_get plms.defl=myMeshes
    //% group="render"
    //% weight=9
    export function renderAll(plms: mesh[], output: Image, linecolor?: number) {
        if (!plms || !output || plms.length <= 0) return;
        if (inProcess[1]) return;
        inProcess[1] = true
        const depths = plms.map(plm => meshDepthZ(plm));
        const sorted = plms.map((m, i) => ({ mesh: m, depth: depths[i] }));
        switch (sort) {
            case 0: sorted.sort((a, b) => b.depth - a.depth); break
            case 1: introSort(sorted, (a, b) => b.depth - a.depth); break
        }
        for (const m of sorted) if (!m.mesh.flag.invisible) render(m.mesh, output, linecolor);
        inProcess[1] = false
    }

    //% blockId=poly_rendermesh
    //% block=" $plm render to $output=screen_image_picker|| as line render color? $linecolor=colorindexpicker"
    //% plm.shadow=variables_get plm.defl=myMesh
    //% group="render"
    //% weight=10
    export function render(plm: mesh, output: Image, linecolor?: number) {
        if (!plm || !output || plm.points.length <= 0 || plm.faces.length <= 0) return;
        if (plm.flag.invisible) return;
        
        if (inProcess[0]) return;
        inProcess[0] = true

        const centerX = output.width >> 1;
        const centerY = output.height >> 1;

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
                scale: scale,
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
            let idx: number, pt: {scale: number, x: number, y: number, z: number}, cx: number, cy: number, scale: number, range: number, baseW: number, baseH: number, halfW: number, halfH: number, square: number
            if (t.indices.length === 1) {
                idx = t.indices[0];
                pt = rotated[idx];

                // center image
                cx = pt.x;
                cy = pt.y;

                scale = pt.scale;
                range = scale * zoom / 4.2
                if (t.img) {
                    // set scale image from camera distance
                    baseW = t.img.width;
                    baseH = t.img.height;

                    halfW = (baseW / 2) * scale * zoom;
                    halfH = (baseH / 2) * scale * zoom;
                    if (isOutOfArea(cx + halfW, cy + halfH, output.width, output.height) && isOutOfArea(cx - halfW, cy - halfH, output.width, output.height)) continue;
                } else {
                    if (isOutOfArea(cx + range, cy + range, output.width, output.height) && isOutOfArea(cx - range, cy - range, output.width, output.height)) continue;
                }
            } else if (inds.every(i => (isOutOfArea(rotated[i].x, rotated[i].y, output.width, output.height)))) continue;
            
            // Backface culling
            if (!plm.flag.noncull) if (isFaceVisible(rotated, inds, plm.flag.backface)) continue;
                
            idx = t.indices[0];
            pt = rotated[idx];
            scale = pt.scale;
            // center image
            cx = pt.x;
            cy = pt.y;

            square = 1

            if (t.img) {
                // set scale image from camera distance
                baseW = t.img.width;
                baseH = t.img.height;

                halfW = (baseW / 2) * scale * zoom;
                halfH = (baseH / 2) * scale * zoom;

                square = Math.min(halfW, halfH)
            }
            // LOD calculating?
            let mydist = avgZ(rotated, inds) < -Math.abs(dist) / 64.8 ? range : Math.round((avgZ(rotated, inds) + Math.abs(dist / 2.2)) / Math.abs(2.2 * zoom));
            // when have 2D image billboard (indices.length == 1 and img)
            if (t.indices.length === 1) {
                if (pt.z < -Math.abs(dist)) continue;

                // when no image
                if (!t.img) {
                    fillCircleImage(output, cx, cy, scale * zoom / 2.2, t.color)
                    continue;
                }

                // fill circle if image is empty
                if (isEmptyImage(t.img)) {
                    fillCircleImage(output, cx, cy, Math.floor(square), t.color)
                    continue;
                }

                halfW /= 1.2
                halfH /= 1.2
                
                // Draw Simple 2D image (billboard) as quad pixel on image
                // use distortImage or drawing without perspective distortion
                // I will use distortImage draw as vertex quad
                distortImage(t.img.clone(), output,
                    cx - halfW, cy - halfH,
                    cx + halfW, cy - halfH,
                    cx - halfW, cy + halfH,
                    cx + halfW, cy + halfH,
                    mydist, true, true);
                continue;
            }

            if (inds.length < 2) continue;
            // Draw line canvas when have line color index
            if (linecolor && linecolor > 0) {
                helpers.imageDrawLine(output, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[1]].x, rotated[inds[1]].y, linecolor);
                if (inds.length < 3) continue;
                helpers.imageDrawLine(output, rotated[inds[0]].x, rotated[inds[0]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                if (inds.length > 3) helpers.imageDrawLine(output, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[1]].x, rotated[inds[1]].y, linecolor), helpers.imageDrawLine(output, rotated[inds[3]].x, rotated[inds[3]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                else helpers.imageDrawLine(output, rotated[inds[1]].x, rotated[inds[1]].y, rotated[inds[2]].x, rotated[inds[2]].y, linecolor);
                continue;
            }
            
            // Draw line when no shape
            helpers.imageDrawLine( output,
                rotated[inds[0]].x, rotated[inds[0]].y,
                rotated[inds[1]].x, rotated[inds[1]].y,
                t.color
            );
            // Draw solid when is vertice shape
            if (inds.length > 2) {
                helpers.imageFillTriangle( output,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    t.color
                );
            }
            if (inds.length > 3) {
                helpers.imageFillTriangle( output,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    t.color
                );
            }

            // Draw texture over
            if (inds.length === 4 && t.img) {
                distortImage(t.img.clone(), output,
                    rotated[inds[0]].x, rotated[inds[0]].y,
                    rotated[inds[1]].x, rotated[inds[1]].y,
                    rotated[inds[2]].x, rotated[inds[2]].y,
                    rotated[inds[3]].x, rotated[inds[3]].y,
                    mydist
                );
            }

        }
        
        inProcess[0] = false
    }

    function fillCircleImage(dest: Image, x: number, y: number, r: number, c: number) {
        let src = image.create(Math.max(r * 2, 1), Math.max(r * 2, 1))
        if (r > 1) helpers.imageFillCircle(src, r, r, r, c)
        else src.fill(c)
        let src0 = src.clone()
        src0.flipX()
        src.drawTransparentImage(src0.clone(), 0, 0)
        src0.flipY()
        src.drawTransparentImage(src0.clone(), 0, 0)
        dest.drawTransparentImage(src, x - r, y - r)
    }

    function isEmptyImage(img: Image) { return img.equals(image.create(img.width, img.height)) }

    function isOutOfArea(x: number, y: number, width: number, height: number) { return isOutOfRange(x, width) || isOutOfRange(y, height) }

    function isOutOfRange(x: number, range: number) { return x < 0 || x >= range }

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

    function avgZ(rot: { z: number }[], inds: number[]): number { return inds.reduce((s, i) => s + rot[i].z, 0) / inds.length; }

    function gapAround(n: number, r: number, g: number) { n -= Math.round(r / 2), n /= g, n += Math.round(r / 2); return Math.round(n) }

    function distortImage(src: Image, dest: Image,
        X1: number, Y1: number, X2: number, Y2: number,
        X3: number, Y3: number, X4: number, Y4: number, Z: number, reX?: boolean, reY?: boolean) {
        Z = Math.max(Z, 1)
        Z = Math.min(Z, Math.min(src.width, src.height))
        const sumW = Math.max(1, Math.floor(src.width / Z)), sumH = Math.max(1, Math.floor(src.height / Z))
        for (let y = 0; y < sumH; y++) {
            for (let x = 0; x < sumW; x++) {
                const col = src.getPixel(reX ? gapAround(x * Z, src.width, Z) : src.width - gapAround(x * Z, src.width, Z), reY ? gapAround(y * Z, src.height, Z) : src.height - gapAround(y * Z, src.height, Z));
                if (!col || col <= 0) continue;
                const sx = (s: number, m?: boolean) => Math.trunc((1 - ((y * s) + (m ? s : 0) - (s / 2)) / (sumH * s)) * (X1 + ((x * s) + (m ? s : 0) - (s / 2)) / (sumW * s) * (X2 - X1)) + ((y * s) + (m ? s : 0) - (s / 2)) / (sumH * s) * (X3 + ((x * s) + (m ? s : 0) - (s / 2)) / (sumW * s) * (X4 - X3)))
                const sy = (s: number, m?: boolean) => Math.trunc((1 - ((x * s) + (m ? s : 0) - (s / 2)) / (sumW * s)) * (Y1 + ((y * s) + (m ? s : 0) - (s / 2)) / (sumH * s) * (Y3 - Y1)) + ((x * s) + (m ? s : 0) - (s / 2)) / (sumW * s) * (Y2 + ((y * s) + (m ? s : 0) - (s / 2)) / (sumH * s) * (Y4 - Y2)))
                if (isOutOfArea(sx(zoom), sy(zoom), dest.width, dest.height) && isOutOfArea(sx(zoom, true), sy(zoom, true), dest.width, dest.height)) continue;
                helpers.imageFillTriangle(dest, sx(zoom, true), sy(zoom), sx(zoom), sy(zoom), sx(zoom, true), sy(zoom, true), col)
                helpers.imageFillTriangle(dest, sx(zoom), sy(zoom, true), sx(zoom), sy(zoom), sx(zoom, true), sy(zoom, true), col)
            }
        }
    }

    export class shadowIndices { constructor(public i1: number, public i2?: number, public i3?: number, public i4?: number) { } }
    //% blockId=poly_shadow_indices
    //% block="indice of i1 $i1|| i2 $i2 i3 $i3 i4 $i4"
    //% blockHidden=true
    export function indiceShadow(i1: number, i2?: number, i3?: number, i4?: number) { return new shadowIndices(i1, i2, i3, i4) }

    export class shadowPoint3 { constructor(public x: number, public y: number, public z: number) { } }
    //% blockId=poly_shadow_point3
    //% block="x: $x y: $y z: $z"
    //% blockHidden=true
    export function point3Shadow(x: number, y: number, z: number) { return new shadowPoint3(x, y, z) }
}
