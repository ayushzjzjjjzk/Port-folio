
export const SCENE_POSITIONS = {
    desk: [0, 0, 0] as [number, number, number],
    notebook: [-0.01, 1.05, 0.1] as [number, number, number],
    lamp: [0.70, 1.0, -0.1] as [number, number, number],
    vinylPlayer: [-0.80, 1.0, 0.1] as [number, number, number],
    bookshelf: [0, 0, -2.5] as [number, number, number],
    coffeeMug: [0.7, 1.1, 0.3] as [number, number, number],
    pen: [-0.3, 1.0, 0.3] as [number, number, number],
};

export const CAMERA = {
    initialPosition: [0, 2.5, 3.5] as [number, number, number],
    zoomedPosition: [0, 2.0, 2.5] as [number, number, number],
    lookAt: [0, 0.5, 0] as [number, number, number],
    fov: 50,
};

export const COLORS = {
    warmYellow: '#F4D03F',
    cream: '#FFF8E7',
    warmBrown: '#8B4513',

    softOrange: '#FFB347',
    deepBrown: '#3E2723',
    softBlue: '#E3F2FD',

    gold: '#FFD700',
    darkGray: '#2C2C2C',

    background: '#0a0a0a',
    ambientDim: '#E3F2FD',
};

export const LIGHTING = {
    lampOff: {
        ambientIntensity: 0.25,
        pointIntensity: 0,
        spotIntensity: 0,
    },
    lampOn: {
        ambientIntensity: 0.4,
        pointIntensity: 2.5,
        spotIntensity: 1,
    },
};

export const PAGES = {
    cover: 0,
    tableOfContents: 1,
    aboutStart: 2,
    projectsStart: 4,
    experienceStart: 10,
    skillsStart: 12,
    contactStart: 14,
    total: 16,
};