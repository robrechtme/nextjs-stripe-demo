import { createGlobalStyle, ThemeProvider } from "styled-components";
import type { AppProps } from "next/app";
import { Normalize } from "styled-normalize";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
html, 

body {
  font-family: 'Montserrat', sans-serif;
  height: 100%;
}
#__next {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
`;

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Normalize />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
