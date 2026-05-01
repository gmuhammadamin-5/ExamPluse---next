"use client";
import dynamic from "next/dynamic";
const MockCenters = dynamic(() => import("./MockCenters"), { ssr: false });
export default function MockCentersClient() { return <MockCenters />; }
