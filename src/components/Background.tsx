import React from "react";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import useMouse from "../hooks/useMouse";
import useWindowSize from "../hooks/useWindowSize";

const COLORS = ["#806ae4", "#ff8b91", "#a0b0ff", "#FFFFFF", "#f384ff"];

const CanvasContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
`;

const BackgroundImage = styled.img`
  position: fixed;
  inset: 0;
`;

const positions = [
  Math.random() * 10 - 5,
  Math.random() * 10 - 5,
  Math.random() * 10 - 5,
];

export default function Background() {
  const { x, y } = useMouse();
  const { width, height } = useWindowSize();
  const dX = (2 * (x - width! / 2)) / width!;
  const dY = (2 * (y - height! / 2)) / height!;
  console.log({ dX, dY });
  return (
    <CanvasContainer>
      <BackgroundImage src="/bg.jpg" />
      <Canvas>
        <mesh rotation={[dY * -0.01, dX * -0.01, 0]}>
          <mesh position={[-1, -1, 0]}>
            <torusKnotGeometry args={[1, 0.4, 256, 64]} />
            <meshStandardMaterial />
          </mesh>
          {/* Small objects */}
          <mesh position={[4, -3, -3]}>
            <octahedronGeometry />
            <meshStandardMaterial />
          </mesh>
          <mesh position={[-8, 3, -5]} rotation={[0.2, 0.2, 0.2]}>
            <coneGeometry args={[0.5, 1.5, 64]} />
            <meshStandardMaterial />
          </mesh>
          <mesh position={[8, 5, -8]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial />
          </mesh>
          <mesh position={[-12, -8, -12]}>
            <sphereGeometry args={[0.5, 64, 64]} />
            <meshStandardMaterial />
          </mesh>

          {/*  */}
          <pointLight color={COLORS[0]} position={[1.5, 4, 0]} />
          <pointLight
            color={COLORS[1]}
            position={[-7, -3.5, 2]}
            intensity={2}
          />
          <pointLight color={COLORS[2]} position={[5, -5, -4]} />
          <pointLight color={COLORS[3]} position={[-8, 5, 4]} intensity={0.5} />
          <pointLight color={COLORS[4]} position={[9, 0, 2]} />
          <ambientLight intensity={0.09} />
        </mesh>
      </Canvas>
    </CanvasContainer>
  );
}
