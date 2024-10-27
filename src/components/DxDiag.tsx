"use client";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { WindowFrame } from "@/components/WindowFrame";
import { MaximizeButton } from "@/components/MaximizeButton";
import { CloseIcon, Github, Globe, LinkedIn } from "@/components/icons";

export function DxDiag() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button title="DxDiag" onClick={handleModalOpen} className="shortcut">
        <img src="/assets/System.svg" alt="TxtFile" />
        <span>System</span>
      </button>
      <Modal isOpen={isModalOpen}>
        <WindowFrame>
          <div className="window-header" data-dragcontrol="true">
            <span className="window-header-left">
              <img src="/assets/System.svg" alt="" />
              <span>System</span>
            </span>
            <div className="window-header-buttons">
              <MaximizeButton />
              <button
                type="button"
                className="outset"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close Diagnostic Tools">
                <CloseIcon />
              </button>
            </div>
          </div>
          <div className="system-content">
            <h1>System Information</h1>
            <div className="sc-wrap">
              <div className="system-container">
                <h2>Core Technologies</h2>
                <ul>
                  <li>
                    <a href="https://nextjs.org/" target="_blank">
                      Next.js 15
                    </a>
                  </li>
                  <li>
                    <a href="https://react.dev" target="_blank">
                      React 19 RC
                    </a>
                  </li>
                  <li>
                    <a href="https://www.typescriptlang.org/" target="_blank">
                      TypeScript 5.6.3
                    </a>
                  </li>
                  <li>
                    <a href="https://www.postgresql.org/" target="_blank">
                      PostgreSQL
                    </a>
                  </li>
                  <li>
                    <a href="https://vercel.com/" target="_blank">
                      Vercel Hosting
                    </a>
                  </li>
                  <li>
                    <a href="https://create.t3.gg/" target="_blank">
                      Initially based on T3 Stack
                    </a>
                  </li>
                </ul>
              </div>
              <div className="system-container">
                <h2>Libraries</h2>
                <table className="system-table">
                  <tbody>
                    <tr>
                      <th>Authentication:</th>
                      <td>
                        <a href="https://lucia-auth.com/" target="_blank">
                          Lucia Auth
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>Hashing</th>
                      <td>
                        <a href="https://www.npmjs.com/package/@node-rs/argon2" target="_blank">
                          Argon2
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>ORM:</th>
                      <td>
                        <a href="https://orm.drizzle.team/" target="_blank">
                          Drizzle ORM
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>Validation:</th>
                      <td>
                        <a href="https://zod.dev/" target="_blank">
                          Zod
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>Error Management:</th>
                      <td>
                        <a href="https://sentry.io/">Sentry</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="system-container">
                <h2>Other</h2>
                <table className="system-table">
                  <tbody>
                    <tr>
                      <th>Analytics:</th>
                      <td>
                        <a href="https://plausible.io/">Plausible</a>
                      </td>
                    </tr>
                    <tr>
                      <th>Rate Limiting:</th>
                      <td>Self (Database)</td>
                    </tr>
                    <tr>
                      <th>User Interface:</th>
                      <td>Self (Based on Microsoft Windows 95)</td>
                    </tr>
                    <tr>
                      <th>Assets (SVGs):</th>
                      <td>Self (Inkscape)</td>
                    </tr>
                    <tr>
                      <th>Basic Icons:</th>
                      <td>
                        <a href="https://heroicons.com/" target="_blank">
                          heroicons
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="window-footer system-footer">
            <span>Copyright &#169; 2024 MGSimard. All rights reserved.</span>
            <div>
              <a href="https://mgsimard.github.io/" target="_blank">
                <Globe />
              </a>
              <a href="https://github.com/MGSimard/" target="_blank">
                <Github />
              </a>
              <a href="https://www.linkedin.com/in/mgsimard/" target="_blank">
                <LinkedIn />
              </a>
            </div>
          </div>
        </WindowFrame>
      </Modal>
    </>
  );
}
