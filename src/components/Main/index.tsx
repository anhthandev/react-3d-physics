import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Physics/physicsEngineComponent";
import "./styles.css";

import { useRef } from "react";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Nullable } from "@babylonjs/core/types";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene, Engine, Skybox } from "react-babylonjs";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { CannonJSPlugin } from "@babylonjs/core/Physics/Plugins";
import { Ball } from "components/Ball";

import * as CANNON from "cannon";
global.CANNON = CANNON;

const GRAVITY_VECTOR = new Vector3(0, -9.81, 0);
const GROUND_SIZE = 1000;

export const Main = () => {
  const ballRef = useRef<Nullable<Mesh>>(null);
  const cameraRef = useRef<any>(null);

  const pushBall = () => {
    if (ballRef.current !== null && cameraRef.current !== null) {
      const direction = cameraRef.current
        .getFrontPosition(1)
        .subtract(cameraRef.current.position)
        .normalize();
      ballRef.current.physicsImpostor?.applyImpulse(
        direction.scale(3),
        ballRef.current.getAbsolutePosition()
      );
    }
  };

  return (
    <Engine antialias adaptToDeviceRatio canvasId="main-canvas">
      <Scene
        enablePhysics={[GRAVITY_VECTOR, new CannonJSPlugin()]}
        clearColor={new Color4(0, 0, 0)}
      >
        <Skybox rootUrl="assets/textures/Sky/TropicalSunnyDay" />
        <universalCamera
          ref={cameraRef}
          name="camera"
          position={new Vector3(-10, 5, -10)}
          rotation={new Vector3(0, 1, 0)}
          target={new Vector3(0, 1, 0)}
          minZ={0.001}
        />
        <hemisphericLight
          name="hemi"
          direction={new Vector3(0, -1, 0)}
          intensity={0.8}
        />
        <directionalLight
          name="shadow-light"
          setDirectionToTarget={[Vector3.Zero()]}
          direction={Vector3.Zero()}
          position={new Vector3(-40, 10, -40)}
          intensity={0.4}
          shadowMinZ={1}
          shadowMaxZ={2500}
        >
          <shadowGenerator
            mapSize={1024}
            useBlurExponentialShadowMap={true}
            blurKernel={32}
            darkness={0.8}
            shadowCasters={["sphere", "dialog"]}
            forceBackFacesOnly={true}
            depthScale={100}
          />
        </directionalLight>

        <Ball
          ref={ballRef}
          position={new Vector3(0, 5, 0)}
          onClick={pushBall}
        />

        <ground
          name="ground"
          width={GROUND_SIZE}
          height={GROUND_SIZE}
          subdivisions={1}
          receiveShadows={true}
        >
          <physicsImpostor
            type={PhysicsImpostor.BoxImpostor}
            _options={{ mass: 0, restitution: 0.9 }}
          />
        </ground>


        <vrExperienceHelper
          webVROptions={{ createDeviceOrientationCamera: false }}
          enableInteractions={true}
        />
      </Scene>
    </Engine>
  );
};
