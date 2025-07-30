"use client";

import { useEffect } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/BootstrapDropdown.scss';

export default function BootstrapClient() {
  useEffect(() => {
    // @ts-ignore
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}
