import './index.scss'

export const config = {
    unstable_runtimeJS: false
}

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

export default MyApp