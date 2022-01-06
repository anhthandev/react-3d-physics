import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { Color3 } from "@babylonjs/core/Maths/math.color";

import { useClick } from "react-babylonjs";
import { forwardRef, MutableRefObject, ReactNode, Ref } from "react";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Nullable } from "@babylonjs/core/types";

type BallProps = {
  position: Vector3;
  onClick?: () => void;
};

export const Ball = forwardRef(
  (
    { position, onClick, ...props }: BallProps,
    ref: MutableRefObject<Nullable<Mesh>> | Ref<ReactNode>
  ) => {
    useClick(() => {
      if (
        (ref as MutableRefObject<Nullable<Mesh>>).current !== null &&
        onClick
      ) {
        onClick();
      }
    }, ref as MutableRefObject<Nullable<Mesh>>);

    return (
      <icoSphere
        ref={ref}
        name="sphere"
        radius={1}
        flat
        subdivisions={2}
        position={position}
        {...props}
      >
        <physicsImpostor
          type={PhysicsImpostor.SphereImpostor}
          _options={{ mass: 1, restitution: 0.9 }}
        />
        <standardMaterial
          name="sphere-material"
          diffuseColor={Color3.Red()}
          specularColor={Color3.Black()}
        />
      </icoSphere>
    );
  }
);
