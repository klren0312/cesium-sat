const muE = 3.98600e5

function deg2Rad (deg) {
    return (deg * Math.PI) / 180
}

function oeToSv (OE, useDegree = true) {
    let a = OE.semiajor_axis
    let e = OE.eccentric
    let i = OE.inclination
    let Omega = OE.longitudeAccendingNode
    let w = OE.argumentOfPericenter
    let Theta = OE.meanAnomaly
    let h = 0

    try {
        if (e < 1) {
            h = Math.sqrt(a * muE * (1 - Math.pow(e, 2)))
        } else if (e > 1) {
            h = Math.sqrt(-a * muE * (Math.pow(e, 2) - 1))
        }
        if (useDegree) {
            i = deg2Rad(i)
            Omega = deg2Rad(Omega)
            w = deg2Rad(w)
            Theta = deg2Rad(Theta)
        }
        let rP = vec3.fromValues(
            Math.pow(h, 2) / (muE * (1 + e * Math.cos(Theta))) * Math.cos(Theta),
            Math.pow(h, 2) / (muE * (1 + e * Math.cos(Theta))) * Math.sin(Theta),
            0
        )
        let QXx = mat3.create()
        let QXx1 = mat3.fromValues(
            Math.cos(w), Math.sin(w), 0,
            -Math.sin(w), Math.cos(w), 0,
            0, 0, 1
        )
        let QXx2 = mat3.fromValues(
            1, 0, 0,
            0, Math.cos(i), Math.sin(i),
            0, -Math.sin(i), Math.cos(i)
        )
        let QXx3 = mat3.fromValues(
            Math.cos(Omega), Math.sin(Omega), 0,
            -Math.sin(Omega), Math.cos(Omega), 0,
            0, 0, 1
        )
        mat3.multiply(QXx, QXx1, QXx2)
        mat3.multiply(QXx, QXx, QXx3)

        let RG = vec3.create()
        // mat3.multiply(RG, mat3.transpose(QXx, QXx), rP)
        mat3.multiply(RG, QXx, rP)
        return RG
    } catch (error) {
        console.error(error)
        return vec3.create()
    }
}
