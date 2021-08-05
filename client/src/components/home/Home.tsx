import React, { BaseSyntheticEvent, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { TransitionGroup } from 'react-transition-group';
import { TopArtistsAndTracks } from './index';
import { Container } from '@material-ui/core';

const Home = (_props: any) => {
    const [topType, setTopType] = useState('artists');

    const handleChangeType = useCallback((e: BaseSyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setTopType(e.target.value);
    }, []);

    //#region renders
    const renderSideMenu = useCallback(() => {
        return (
            <div className="flex flex-col" style={{ marginRight: '1rem' }}>
                <option value="artists" onClick={handleChangeType} className="option-container">
                    Top Artists
                </option>
                <option
                    value="tracks"
                    onClick={handleChangeType}
                    className="option-container"
                    style={{ marginTop: '1rem' }}
                >
                    Top Tracks
                </option>
            </div>
        );
    }, [handleChangeType]);
    //#endregion

    // main render
    return (
        <React.Fragment>
            <Helmet>
                <title>festival.me - Home</title>
            </Helmet>
            <Container className="body-container">
                <TransitionGroup id="home-tsg">
                    <div className="flex-row flex-justify-center">
                        <div className="flex flex-1" style={{ justifyContent: 'space-evenly' }}>
                            {renderSideMenu()}
                            <TopArtistsAndTracks type={topType} />
                        </div>
                    </div>
                </TransitionGroup>
            </Container>
        </React.Fragment>
    );
};

export default Home;
