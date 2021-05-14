import MainScene from './mainscene.js'
import LoadScene from './loadscene.js'

const config = {
    width: 768,
    height: 1024,
    type: Phaser.AUTO,
    parent: 'game-canvas',
    backgroundColor: '#3ccd41',
    scene: [LoadScene, MainScene]
}

new Phaser.Game(config);