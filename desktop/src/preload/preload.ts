import { contextBridge } from 'electron';
import Bridge from './Bridge';

contextBridge.exposeInMainWorld('Bridge', new Bridge());
