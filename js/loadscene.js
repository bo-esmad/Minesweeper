export default class LoadScene extends Phaser.Scene {
    constructor() {
        super('LoadScene');
    }

    preload() {
        this.load.image('bg', './images/backGround.png');
        this.load.image('square', './images/square.png');
        this.load.image('squarePressed', './images/squarePressed.png');
        this.load.image('bomb', './images/bomb.png');
        this.load.image('bombRed', './images/bombRed.png');
        this.load.image('flag', './images/flag.png');
    }

    create() {
        this.input.mouse.disableContextMenu();

        this.scene.start('MainScene');
    }
}