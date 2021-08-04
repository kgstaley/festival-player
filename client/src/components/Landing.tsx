import { Container, Typography, useTheme } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { logger } from '../common-util';
import { AppCtx } from '../context';

const Landing = (props: any) => {
    const theme = useTheme();
    const { state } = useContext(AppCtx);

    const { palette } = theme;

    useEffect(() => {
        logger('state.isAuthenticated in Landing.tsx', state.isAuthenticated);
        if (!!state.isAuthenticated) {
            props.history.push('/dashboard');
        }
    }, [state.isAuthenticated, props.history]);

    // main render
    return (
        <React.Fragment>
            <Container
                style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <div
                    className="body-container"
                    style={{
                        backgroundColor: palette.info.main,
                        borderRadius: '10px',
                        alignSelf: 'center',
                        boxShadow: '2px 2px 10px 1px rgba(0, 0, 0, 0.3)',
                        marginTop: '4rem',
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h2"
                        style={{
                            display: 'flex',
                            flex: 1,
                            color: palette.text.primary,
                            fontFamily: 'monospace',
                        }}
                    >
                        Welcome to festival.me!
                    </Typography>
                    <div style={{ paddingTop: '1rem' }}>
                        <Typography
                            variant="h5"
                            component="h5"
                            style={{
                                color: palette.text.primary,
                                fontFamily: 'monospace',
                            }}
                        >
                            Autogenerate playlists with your favorite artists, albums, or festival lineups.
                        </Typography>
                        <div style={{ paddingTop: '1rem' }}>
                            <span
                                style={{
                                    fontSize: '14px',
                                    color: palette.text.primary,
                                    fontFamily: 'monospace',
                                }}
                            >
                                ( You must login to Spotify to use this app. )
                            </span>
                        </div>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
};

export default Landing;
