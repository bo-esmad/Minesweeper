import {Tile} from './tile.js'

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    init() { 
        this.board = {
            width: 7,
            height: 9,
            bombs: 9,
            tile_size: 96,
            offset: {
                x: 102,
                y: 160
            }
        }


        this.input.keyboard.on('keydown-V', event => {
            this.showBoard(event);
        });

        this.input.on('gameobjectup', (pointer, go, event) => {
            this.mousePressed(pointer, go, event);
        });
    }

    preload() { }

    create() { 

        this.bg = this.add.sprite(0, 0, 'bg').setOrigin(0);

        this.createMap();
        this.placeBombs();
        this.countBombs();
    }

    update(time) { }

    createMap() {
        let tile_faces = {
            base: 'squarePressed',
            covered: 'square',
            bomb: 'bomb',
            explosion: 'bombRed',
            flag: 'flag'
        }

        this.tiles = [];

        for(let w = 0; w < this.board.width; w++) {
            for(let h = 0; h < this.board.height; h++) {
                let t = new Tile(
                    this,
                    w * this.board.tile_size + this.board.offset.x,
                    h * this.board.tile_size + this.board.offset.y,
                    w, h,
                    tile_faces);
                this.add.existing(t);
                this.tiles.push(t);
            }
        }
    } 

    placeBombs() {
        let bomb_count = 0;
        while(bomb_count < this.board.bombs) {
            let w = Math.floor(Math.random() * this.board.width);
            let h = Math.floor(Math.random() * this.board.height);
    
            let t = this.tiles[w * this.board.height + h];
            if(!t.isBomb())
            {
                t.turnIntoBomb();
                bomb_count++;                    
            }
        }
    }

    countBombs() {
        this.tiles.forEach(
            t => {
                if(t.isBomb()) {
                    return;
                }

                let grid_pos = t.grid_pos;
                
                let start_x = Math.max(grid_pos.x - 1, 0);
                let end_x = Math.min(grid_pos.x + 1, this.board.width - 1);

                let start_y = Math.max(grid_pos.y - 1, 0);
                let end_y = Math.min(grid_pos.y + 1, this.board.height - 1);

                let bomb_count = 0;

                for(let w = start_x; w <= end_x; w++) {
                    for(let h = start_y; h <= end_y; h++) {
                        if(w == grid_pos.x && h == grid_pos.y) {
                            continue;
                        }

                        let other = this.tiles[w * this.board.height + h];
                        if(other.isBomb()) {
                            bomb_count++;
                        }
                    }
                }

                t.setNumberOfBombs(bomb_count);
            }
        );
    }

    mousePressed(pointer, go, event) {
        if(go.revealed == true) {
            return;
        }

        if(pointer.rightButtonReleased()) {
            go.mark();
        } else if(!go.flagged){
            go.reveal();
            if(go.isBomb())
            {
                go.explode();
                console.log("You Lose!")
            } else {
                this.showOtherTiles(go);
            }
        }
    }

    showOtherTiles(tile) {
        if(!tile.isBomb() && tile.number_of_bombs == 0){
            let grid_pos = tile.grid_pos;
                
            let start_x = Math.max(grid_pos.x - 1, 0);
            let end_x = Math.min(grid_pos.x + 1, this.board.width - 1);

            let start_y = Math.max(grid_pos.y - 1, 0);
            let end_y = Math.min(grid_pos.y + 1, this.board.height - 1);


            for(let w = start_x; w <= end_x; w++) {
                for(let h = start_y; h <= end_y; h++) {
                    
                    let other = this.tiles[w * this.board.height + h];
                    if(!other.isBomb() && !other.revealed && !other.flagged) {
                        other.reveal();
                        this.showOtherTiles(other);
                    }
                }
            }
        }
        this.checkVictory();
    }

    checkVictory() {
        let flagged_bombs = 0;
        let revealed = 0;

        this.tiles.forEach( t => {
            if(t.isBomb() && t.flagged) {
                flagged_bombs++;
            } else if (t.revealed){
                revealed++;
            }
        });

        if(flagged_bombs + revealed == this.tiles.length) {
            console.log("YOU WON!");
        }
    }

    showBoard() {
        this.tiles.forEach(t => t.toggleGodMode());
    }
}