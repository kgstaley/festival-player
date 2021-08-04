import React, { BaseSyntheticEvent, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';
import { TransitionGroup } from 'react-transition-group';
import { TopArtistsAndTracks } from './common-ui';

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
            <React.Fragment>
                <div>
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
            </React.Fragment>
        );
    }, [handleChangeType]);
    //#endregion

    // main render
    return (
        <React.Fragment>
            <Helmet>
                <title>festival.me - Home</title>
            </Helmet>
            <TransitionGroup id="home-tsg">
                <div className="body-container flex-row flex-justify-center">
                    <div className="flex">
                        {renderSideMenu()}
                        <TopArtistsAndTracks type={topType} />
                    </div>
                </div>
            </TransitionGroup>
        </React.Fragment>
    );
};

export default Home;
