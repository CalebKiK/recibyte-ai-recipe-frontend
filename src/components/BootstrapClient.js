"use client";

import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BootstrapClient() {
  useEffect(() => {
    // @ts-ignore
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}
