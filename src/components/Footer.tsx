import styled, { css } from 'styled-components';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import React from 'react';
import { ipcRenderer } from 'electron';
import TabPageStore, { useStore, View } from '../store/tab-page-store';
import HistoryButton from './HistoryButton';
import gearImg from '../../assets/gear.svg';
import NavButtonParent from './NavButtonParent';

const FooterParent = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TheThing = styled.div`
  width: 50px;
  height: 50px;
  margin: 0 4px 0 4px;
`;
const PlusButtonParent = styled.button`
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  border: none;
  outline: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 4px 0 4px;
  overflow: hidden;
  transition-duration: 0.25s;
  background-color: rgba(0, 0, 0, 0.25);

  :hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;
const FooterButtonParent = styled.button`
  font-size: 0.8rem;
  font-weight: bold;
  border: none;
  outline: none;
  width: 120px;
  height: 75px;
  border-radius: 1rem;
  margin: 0 4px 0 4px;
  overflow: hidden;
  background-color: red;
  transition-duration: 0.1s;
  color: ghostwhite;
  ${({ active }: { active: boolean }) => {
    if (active) {
      return css`
        background-color: rgba(0, 0, 0, 0.5);
        :hover {
          background-color: rgba(0, 0, 0, 0.6);
        }
      `;
    }

    return css`
      background-color: rgba(0, 0, 0, 0.25);
      :hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
    `;
  }}
`;

const WorkspaceButtons = observer(() => {
  const { tabPageStore, workspaceStore } = useStore();

  const buttons = Array.from(workspaceStore.workspaces.values()).map(
    (workspace) => {
      return (
        <FooterButtonParent
          key={workspace.id}
          active={
            tabPageStore.View === View.WorkSpace &&
            workspace.id === workspaceStore.activeWorkspaceId
          }
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            runInAction(() => {
              if (
                tabPageStore.View === View.WorkSpace &&
                workspaceStore.activeWorkspaceId === workspace.id
              ) {
                ipcRenderer.send(
                  'mixpanel-track',
                  'toggle off workspace with button'
                );
                tabPageStore.View = View.Tabs;
              } else {
                ipcRenderer.send(
                  'mixpanel-track',
                  'toggle on workspace with button'
                );
                workspaceStore.setActiveWorkspaceId(workspace.id);
                tabPageStore.View = View.WorkSpace;
              }
            });
          }}
        >
          {workspace.name}
        </FooterButtonParent>
      );
    }
  );

  return (
    <>
      <TheThing />
      {buttons}
      <PlusButtonParent
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={() => {
          const workspace = workspaceStore.createWorkspace('my new workspace');
          workspace.setShouldEditName(true);
          workspaceStore.setActiveWorkspaceId(workspace.id);
          runInAction(() => {
            tabPageStore.View = View.WorkSpace;
          });
        }}
      >
        +
      </PlusButtonParent>
    </>
  );
});

const RightButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  bottom: 10px;
  right: 10px;
  //width: 125px;
`;

const GearDiv = styled.div`
  background-image: url(${gearImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  width: 30px;
  height: 40%;
`;

function genTogglePage(tabPageStore: TabPageStore, view: View) {
  return () => {
    runInAction(() => {
      if (tabPageStore.View === View.Tabs) {
        tabPageStore.View = view;
      } else if (tabPageStore.View === view) {
        tabPageStore.View = View.Tabs;
      }
    });
  };
}

const Footer = observer(() => {
  const { tabPageStore } = useStore();
  const toggleDebug = genTogglePage(tabPageStore, View.NavigatorDebug);
  const toggleSettings = genTogglePage(tabPageStore, View.Settings);
  return (
    <FooterParent id="footer">
      <WorkspaceButtons />
      <RightButtons>
        <HistoryButton />
        <NavButtonParent
          onClick={() => {
            toggleDebug();
          }}
        >
          Debug
        </NavButtonParent>
        <NavButtonParent
          onClick={() => {
            toggleSettings();
          }}
        >
          <GearDiv />
        </NavButtonParent>
      </RightButtons>
    </FooterParent>
  );
});

export default Footer;
