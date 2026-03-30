

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './TowerBlocks.css';

const TowerBlocks = () => {
  const containerRef = useRef(null);
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    // Wait for GSAP/TweenMax to load from CDN
    const initializeGame = () => {
      if (typeof window.TweenLite === 'undefined' || typeof window.Power1 === 'undefined') {
        console.error('GSAP/TweenMax not loaded. Please add the CDN script to your HTML.');
        return;
      }

      const TweenLite = window.TweenLite;
      const Power1 = window.Power1;

      class Stage {
        constructor() {
          this.container = document.getElementById('game-canvas');
          if (!this.container) return;

          // Renderer
          this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.renderer.setClearColor('#D0CBC7', 1);
          this.container.appendChild(this.renderer.domElement);

          // Scene
          this.scene = new THREE.Scene();

          // Camera
          const aspect = window.innerWidth / window.innerHeight;
          const d = 20;
          this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 1000);
          this.camera.position.set(2, 2, 2);
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));

          // Lights
          this.light = new THREE.DirectionalLight(0xffffff, 0.5);
          this.light.position.set(0, 499, 0);
          this.scene.add(this.light);

          this.softLight = new THREE.AmbientLight(0xffffff, 0.4);
          this.scene.add(this.softLight);

          // Handle resize
          this.handleResize = () => this.onResize();
          window.addEventListener('resize', this.handleResize);
          this.onResize();
        }

        setCamera(y, speed = 0.3) {
          TweenLite.to(this.camera.position, speed, { y: y + 4, ease: Power1.easeInOut });
          this.camera.updateProjectionMatrix();
        }

        onResize() {
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          const aspect = window.innerWidth / window.innerHeight;
          const d = 20;
          this.camera.left = -d * aspect;
          this.camera.right = d * aspect;
          this.camera.top = d;
          this.camera.bottom = -d;
          this.camera.updateProjectionMatrix();
        }

        render() {
          this.renderer.render(this.scene, this.camera);
        }

        add(elem) {
          this.scene.add(elem);
        }

        remove(elem) {
          this.scene.remove(elem);
        }

        destroy() {
          window.removeEventListener('resize', this.handleResize);
          if (this.container && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
          }
          this.renderer.dispose();
        }
      }

      class Block {
        constructor(block) {
          this.STATES = { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
          this.MOVE_AMOUNT = 12;

          this.dimension = { width: 0, height: 0, depth: 0 };
          this.position = { x: 0, y: 0, z: 0 };

          this.targetBlock = block;
          this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
          this.workingPlane = this.index % 2 ? 'x' : 'z';
          this.workingDimension = this.index % 2 ? 'width' : 'depth';

          this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
          this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
          this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;

          this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
          this.position.y = this.dimension.height * this.index;
          this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;

          this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : Math.round(Math.random() * 100);

          if (!this.targetBlock) {
            this.color = 0x333344;
          } else {
            const offset = this.index + this.colorOffset;
            const r = Math.sin(0.3 * offset) * 55 + 200;
            const g = Math.sin(0.3 * offset + 2) * 55 + 200;
            const b = Math.sin(0.3 * offset + 4) * 55 + 200;
            this.color = new THREE.Color(r / 255, g / 255, b / 255);
          }

          this.state = this.index > 1 ? this.STATES.ACTIVE : this.STATES.STOPPED;

          this.speed = -0.5 - this.index * 0.005;
          if (this.speed < -4) this.speed = -4;
          this.direction = this.speed;

          const geometry = new THREE.BoxGeometry(
            this.dimension.width,
            this.dimension.height,
            this.dimension.depth
          );
          geometry.applyMatrix4(
            new THREE.Matrix4().makeTranslation(
              this.dimension.width / 2,
              this.dimension.height / 2,
              this.dimension.depth / 2
            )
          );

          this.material = new THREE.MeshToonMaterial({ color: this.color });
          this.mesh = new THREE.Mesh(geometry, this.material);
          this.mesh.position.set(this.position.x, this.position.y, this.position.z);

          if (this.state === this.STATES.ACTIVE) {
            this.position[this.workingPlane] = Math.random() > 0.5 ? -this.MOVE_AMOUNT : this.MOVE_AMOUNT;
          }
        }

        reverseDirection() {
          this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
        }

        place() {
          this.state = this.STATES.STOPPED;

          const overlap =
            this.targetBlock.dimension[this.workingDimension] -
            Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);

          const blocksToReturn = {
            plane: this.workingPlane,
            direction: this.direction,
          };

          if (this.dimension[this.workingDimension] - overlap < 0.3) {
            blocksToReturn.bonus = true;
            this.position.x = this.targetBlock.position.x;
            this.position.z = this.targetBlock.position.z;
            this.dimension.width = this.targetBlock.dimension.width;
            this.dimension.depth = this.targetBlock.dimension.depth;
          }

          if (overlap > 0) {
            const choppedDimensions = { ...this.dimension };
            choppedDimensions[this.workingDimension] -= overlap;
            this.dimension[this.workingDimension] = overlap;

            const placedGeometry = new THREE.BoxGeometry(
              this.dimension.width,
              this.dimension.height,
              this.dimension.depth
            );
            placedGeometry.applyMatrix4(
              new THREE.Matrix4().makeTranslation(
                this.dimension.width / 2,
                this.dimension.height / 2,
                this.dimension.depth / 2
              )
            );
            const placedMesh = new THREE.Mesh(placedGeometry, this.material);

            const choppedGeometry = new THREE.BoxGeometry(
              choppedDimensions.width,
              choppedDimensions.height,
              choppedDimensions.depth
            );
            choppedGeometry.applyMatrix4(
              new THREE.Matrix4().makeTranslation(
                choppedDimensions.width / 2,
                choppedDimensions.height / 2,
                choppedDimensions.depth / 2
              )
            );
            const choppedMesh = new THREE.Mesh(choppedGeometry, this.material);

            const choppedPosition = { ...this.position };

            if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
              this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
            } else {
              choppedPosition[this.workingPlane] += overlap;
            }

            placedMesh.position.set(this.position.x, this.position.y, this.position.z);
            choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);

            blocksToReturn.placed = placedMesh;
            if (!blocksToReturn.bonus) blocksToReturn.chopped = choppedMesh;
          } else {
            this.state = this.STATES.MISSED;
          }

          this.dimension[this.workingDimension] = overlap;
          return blocksToReturn;
        }

        tick() {
          if (this.state === this.STATES.ACTIVE) {
            const value = this.position[this.workingPlane];
            if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT) {
              this.reverseDirection();
            }
            this.position[this.workingPlane] += this.direction;
            this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
          }
        }
      }

      class Game {
        constructor() {
          this.STATES = {
            LOADING: 'loading',
            PLAYING: 'playing',
            READY: 'ready',
            ENDED: 'ended',
            RESETTING: 'resetting',
          };

          this.blocks = [];
          this.state = this.STATES.LOADING;

          this.stage = new Stage();
          if (!this.stage.container) return;

          this.mainContainer = document.getElementById('game-container');
          this.scoreContainer = document.getElementById('score-display');
          this.instructions = document.getElementById('game-instructions');

          if (!this.mainContainer || !this.scoreContainer || !this.instructions) return;

          this.scoreContainer.innerHTML = '0';

          this.newBlocks = new THREE.Group();
          this.placedBlocks = new THREE.Group();
          this.choppedBlocks = new THREE.Group();

          this.stage.add(this.newBlocks);
          this.stage.add(this.placedBlocks);
          this.stage.add(this.choppedBlocks);

          this.addBlock();
          this.tick();

          this.updateState(this.STATES.READY);

          this.handleKeyDown = (e) => {
            if (e.keyCode === 32) this.onAction();
          };
          this.handleClick = () => this.onAction();
          this.handleTouch = (e) => {
            e.preventDefault();
            this.onAction();
          };

          document.addEventListener('keydown', this.handleKeyDown);
          document.addEventListener('click', this.handleClick);
          document.addEventListener('touchstart', this.handleTouch);
        }

        updateState(newState) {
          for (const key in this.STATES) {
            this.mainContainer.classList.remove(this.STATES[key]);
          }
          this.mainContainer.classList.add(newState);
          this.state = newState;
        }

        onAction() {
          switch (this.state) {
            case this.STATES.READY:
              this.startGame();
              break;
            case this.STATES.PLAYING:
              this.placeBlock();
              break;
            case this.STATES.ENDED:
              this.restartGame();
              break;
            default:
              break;
          }
        }

        startGame() {
          if (this.state !== this.STATES.PLAYING) {
            this.scoreContainer.innerHTML = '0';
            this.updateState(this.STATES.PLAYING);
            this.addBlock();
          }
        }

        restartGame() {
          this.updateState(this.STATES.RESETTING);

          const oldBlocks = this.placedBlocks.children;
          const removeSpeed = 0.2;
          const delayAmount = 0.02;

          for (let i = 0; i < oldBlocks.length; i++) {
            const block = oldBlocks[i];
            TweenLite.to(block.scale, removeSpeed, {
              x: 0,
              y: 0,
              z: 0,
              delay: (oldBlocks.length - i) * delayAmount,
              ease: Power1.easeIn,
              onComplete: () => this.placedBlocks.remove(block),
            });
            TweenLite.to(block.rotation, removeSpeed, {
              y: 0.5,
              delay: (oldBlocks.length - i) * delayAmount,
              ease: Power1.easeIn,
            });
          }

          const cameraMoveSpeed = removeSpeed * 2 + oldBlocks.length * delayAmount;
          this.stage.setCamera(2, cameraMoveSpeed);

          const countdown = { value: this.blocks.length - 1 };
          TweenLite.to(countdown, cameraMoveSpeed, {
            value: 0,
            onUpdate: () => {
              this.scoreContainer.innerHTML = String(Math.round(countdown.value));
            },
          });

          this.blocks = this.blocks.slice(0, 1);

          setTimeout(() => {
            this.startGame();
          }, cameraMoveSpeed * 1000);
        }

        placeBlock() {
          const currentBlock = this.blocks[this.blocks.length - 1];
          const newBlocks = currentBlock.place();

          this.newBlocks.remove(currentBlock.mesh);
          if (newBlocks.placed) this.placedBlocks.add(newBlocks.placed);

          if (newBlocks.chopped) {
            this.choppedBlocks.add(newBlocks.chopped);
            const positionParams = {
              y: '-=30',
              ease: Power1.easeIn,
              onComplete: () => this.choppedBlocks.remove(newBlocks.chopped),
            };

            const rotateRandomness = 10;
            const rotationParams = {
              delay: 0.05,
              x: newBlocks.plane === 'z' ? Math.random() * rotateRandomness - rotateRandomness / 2 : 0.1,
              z: newBlocks.plane === 'x' ? Math.random() * rotateRandomness - rotateRandomness / 2 : 0.1,
              y: Math.random() * 0.1,
            };

            if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
              positionParams[newBlocks.plane] = '+=' + 40 * Math.abs(newBlocks.direction);
            } else {
              positionParams[newBlocks.plane] = '-=' + 40 * Math.abs(newBlocks.direction);
            }

            TweenLite.to(newBlocks.chopped.position, 1, positionParams);
            TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
          }

          this.addBlock();
        }

        addBlock() {
          const lastBlock = this.blocks[this.blocks.length - 1];

          if (lastBlock && lastBlock.state === lastBlock.STATES.MISSED) {
            return this.endGame();
          }

          this.scoreContainer.innerHTML = String(this.blocks.length - 1);

          const newBlock = new Block(lastBlock);
          this.newBlocks.add(newBlock.mesh);
          this.blocks.push(newBlock);

          this.stage.setCamera(this.blocks.length * 2);

          if (this.blocks.length >= 5) this.instructions.classList.add('hide');
        }

        endGame() {
          this.updateState(this.STATES.ENDED);
        }

        tick() {
          if (this.blocks.length > 0) {
            this.blocks[this.blocks.length - 1].tick();
          }
          this.stage.render();
          requestAnimationFrame(() => this.tick());
        }

        destroy() {
          document.removeEventListener('keydown', this.handleKeyDown);
          document.removeEventListener('click', this.handleClick);
          document.removeEventListener('touchstart', this.handleTouch);
          this.stage.destroy();
        }
      }

      // Initialize game
      gameInstanceRef.current = new Game();
    };

    // Check for GSAP every 100ms for up to 5 seconds
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof window.TweenLite !== 'undefined' && typeof window.Power1 !== 'undefined') {
        clearInterval(checkInterval);
        initializeGame();
      } else if (attempts > 50) {
        // Stop after 5 seconds
        clearInterval(checkInterval);
        console.error(
          'GSAP/TweenMax failed to load. Please add this script to your HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js"></script>'
        );
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      if (gameInstanceRef.current && gameInstanceRef.current.destroy) {
        gameInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="tower-blocks-wrapper" ref={containerRef}>
      <div className="tower-blocks-container" id="game-container">
        <div id="game-canvas"></div>
        <div id="score-display">0</div>
        <div id="game-instructions">Click (or press spacebar) to place the block</div>

        <div className="game-ready">
          <button id="start-game-btn">Start Game</button>
        </div>

        <div className="game-over">
          <h2>Game Over</h2>
          <p>Great job! Keep practicing to get a higher score!</p>
          <button>Play Again</button>
        </div>
      </div>
    </div>
  );
};

export default TowerBlocks;