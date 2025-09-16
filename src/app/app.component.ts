import { AfterRenderPhase, Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoxGeometry, Clock, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('myCanvas', {static: false })
  myCanvas!:ElementRef<HTMLCanvasElement>;

  constructor() {
    afterNextRender(
      () => {
        const canvas: HTMLCanvasElement = this.myCanvas.nativeElement;
        const sizes = {
          width: window.innerWidth,
          height: window.innerHeight,
        };

        const scene = new Scene();
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 0x808080 });
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);

        const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
        camera.position.z = 3;
        scene.add(camera);

        const renderer = new WebGLRenderer({canvas});
        renderer.setSize(sizes.width, sizes.height);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const clock = new Clock();

        const tick = () => {
          const elapsedTime = clock.getElapsedTime();

          // mesh.rotation.y = elapsedTime;

          controls.update();

          renderer.render(scene, camera);
          window.requestAnimationFrame(tick);
        };

        tick();
      },
      { phase: AfterRenderPhase.Write }
    );
  }
}
