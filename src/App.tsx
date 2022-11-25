import RuntimeVsWorker from "./containers/RuntimeVsWorker";
import styles from "./App.module.scss";
import { WebGLSquare } from "./containers/WebGLCube";

const App = () => (
  <div>
    <div className={styles.container}>
      <h1>WebGL Square</h1>
      <WebGLSquare />
    </div>

    <div className={styles.container}>
      <h1>Runtime vs Worker rendering</h1>
      <RuntimeVsWorker />
    </div>
  </div>
);

export default App;
