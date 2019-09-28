import fs from 'fs';

import elapsed from './elapsed';
import load from './load';
import save from './save';
import drop from './drop';

export type DatafileOptions = {
  compress?: boolean,
  log?: boolean,
  pretty?: boolean
}

export default class Datafile {
  private path: string;
  options: DatafileOptions;
  constructor(path: string, options: DatafileOptions={}) {
    this.options = options;
    this.path = path;
  }
  load(data: object) {
    let dt: number = 0;
    let result = elapsed(()=>load(data, this.path, {
      compress: this.options.compress
    }), (delta) => {
      dt = delta;
      if(this.options.log) {
        console.log({ message: "database loaded", elapsed: delta });
      }
    });
    return {
      data: result,
      elapsed: dt
    };
  }
  save(data: object) {
    let dt: number = 0;
    elapsed(()=>save(data, this.path, {
      compress: this.options.compress,
      pretty: this.options.pretty
    }), (delta) => {
      dt = delta;
      if(this.options.log) {
        console.log({ message: "database saved", elapsed: delta });
      }
    });
    return {
      data: data,
      elapsed: dt
    }
  }
  drop() {
    let dt: number = 0;
    let data = elapsed(()=>drop(this.path), (delta) => {
      dt = delta;
      if(this.options.log) {
        console.log({ message: "database dropped", elapsed: delta });
      }
    });
    return {
      data: data,
      elapsed: dt
    };
  }
  watch(fn: ()=>void) {
    fs.watch(this.path, (eventType: string) => {
      if(eventType == "change") {
        fn();
      }
    });
  }
  stats() {
    return new Promise((resolve) => {
      fs.stat(this.path, (err, stats) => {
        if(err) {
          console.error(err);
          throw new Error("Cannot read database stats");
        } else {
          resolve({ size: stats.size });
        }
      });
    });
  }
}
