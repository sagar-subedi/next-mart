'use client';

import styled from 'styled-components';

const SidebarWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100vh;
  position: fixed;
  width: 18rem;
  flex-shrink: 0;
  z-index: 202;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.02);
  position: relative;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const GradientBorder = styled.div`
  position: fixed;
  right: calc(100% - 18rem);
  top: 10%;
  bottom: 10%;
  width: 2px;
  background: linear-gradient(to bottom, #64748b 0%, #94a3b8 50%, #cbd5e1 100%);
  z-index: 203;
  pointer-events: none;
  opacity: 0.4;
`;

const Overlay = styled.div`
  position: fixed;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  inset: 0;
  z-index: 201;
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;

  &.active {
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const Header = styled.header`
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), transparent);
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
`;

const Footer = styled.footer`
  padding: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  background: linear-gradient(to top, rgba(255, 255, 255, 0.5), transparent);
`;

export const Sidebar = {
  Wrapper: SidebarWrapper,
  Header,
  Body,
  Footer,
  Overlay,
  GradientBorder,
};
