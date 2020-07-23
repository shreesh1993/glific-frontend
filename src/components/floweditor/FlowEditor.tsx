import React, { useEffect } from 'react';
import { Button } from '../UI/Form/Button/Button';
import styles from './FlowEditor.module.css';
import { Link } from 'react-router-dom';
import { FLOW_EDITOR_API } from '../../config/index';

declare function showFlowEditor(node: any, config: any): void;

const loadscripts = () => {
  const scripts: Array<HTMLScriptElement | HTMLLinkElement> = [];
  const scriptsToLoad = [
    '2.b44c90d1.chunk.js',
    '3.1cea8884.chunk.js',
    'main.e19d5f85.chunk.js',
    'runtime-main.eb708944.js',
  ];

  const styleToLoad = 'main.e9e6650f.chunk.css';

  scriptsToLoad.map((scriptName) => {
    const script = document.createElement('script');
    script.src = '/js/' + scriptName;
    script.id = scriptName.slice(0, 3);
    script.async = false;
    document.body.appendChild(script);
    scripts.push(script);
  });

  const link = document.createElement('link');
  link.href = '/css/' + styleToLoad;
  link.rel = 'stylesheet';
  document.body.appendChild(link);
  scripts.push(link);

  return scripts;
};

const base_glific = FLOW_EDITOR_API;

const setConfig = (uuid: any) => {
  return {
    flow: uuid,
    flowType: 'message',
    localStorage: true,
    mutable: true,
    filters: ['whatsapp'],
    help: {
      legacy_extra: 'help.html',
      missing_dependency: 'help.html',
      invalid_regex: 'help.html',
    },
    endpoints: {
      simulateStart: false,
      simulateResume: false,
      globals: base_glific + 'globals',
      groups: base_glific + 'groups',
      fields: base_glific + 'fields',
      labels: base_glific + 'labels',
      channels: base_glific + 'channels',
      classifiers: base_glific + 'classifiers',
      ticketers: base_glific + 'ticketers',
      resthooks: base_glific + 'resthooks',
      templates: base_glific + 'templates',
      languages: base_glific + 'languages',
      environment: base_glific + 'environment',
      recipients: base_glific + 'recipients',
      completion: base_glific + 'completion',
      activity: base_glific + 'activity',
      flows: base_glific + 'flows',
      revisions: base_glific + 'revisions/' + uuid,
      functions: base_glific + 'functions',
      editor: '/',
    },
  };
};

export const FlowEditor = (props: any) => {
  const config = setConfig(props.match.params.uuid);

  useEffect(() => {
    const scripts = loadscripts();
    return () => {
      scripts.map((node: any) => {
        document.body.removeChild(node);
      });
    };
  }, []);

  useEffect(() => {
    const lastScript: HTMLScriptElement | null = document.body.querySelector('#run');
    if (lastScript) {
      lastScript.onload = () => {
        showFlowEditor(document.getElementById('flow'), config);
      };
    }
  }, []);

  return (
    <>
      <Link to="/automation" className={styles.Link}>
        <Button variant="contained" color="primary" className={styles.Button}>
          Complete
        </Button>
      </Link>
      <div id="flow"></div>
    </>
  );
};
