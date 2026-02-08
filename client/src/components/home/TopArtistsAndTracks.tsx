import { Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { capitalize, logger, usePrevious } from '../../common-util';
import { AppCtx } from '../../context';
import { getTopArtists } from '../../services/spotify';
import { SpotifyRes } from '../../type-defs';
import { ArtistItem, FadeIn, TrackItem } from '../common-ui';

export const TopArtistsAndTracks = ({ type }: { type: string }) => {
    const [init, setInit] = useState(true);
    const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(false);
    const { state } = useContext(AppCtx);

    const theme = useTheme();
    const { palette } = theme;

    const prevType = usePrevious(type);

    //#region api call
    const fetchTop = useCallback(async () => {
        try {
            // setLoading(true);
            logger('fetching top', type);

            const res = await getTopArtists(type);
            logger('res', res);

            const { items } = res;

            setData(items);

            return res;
        } catch (err) {
            logger('error thrown in fetchTop', err);
            throw err;
        } finally {
            setInit(false);
            // setLoading(false);
        }
    }, [type]);
    //#endregion

    //#region useEffects
    useEffect(() => {
        if (type && init) fetchTop();
    }, [fetchTop, init, type]);

    useEffect(() => {
        if (type !== prevType && !init) fetchTop();
    }, [type, fetchTop, prevType, init]);
    //#endregion

    //#region renders

    const renderTop = useCallback(
        (top: SpotifyRes) => {
            if (!top) return null;

            return (
                <FadeIn in key={`top-${top.type}-${top.id}`}>
                    <div
                        className="top-track-item"
                        key={`top-${top.type}-${top.id}`}
                        style={{ backgroundColor: palette.primary.dark }}
                    >
                        <div
                            className="flex flex-1 flex-row flex-align-center"
                            style={{ justifyContent: 'space-between' }}
                        >
                            {top.type === 'artist' && <ArtistItem {...top} />}
                            {top.type === 'track' && <TrackItem {...top} />}
                        </div>
                    </div>
                </FadeIn>
            );
        },
        [palette],
    );

    const mapRenderTops = useCallback(() => {
        if (!data || !!!data.length) return null;
        return data.map(renderTop);
    }, [data, renderTop]);
    //#endregion

    // main render
    return (
        <div id="top-track-artist-container" style={{ backgroundColor: palette.primary.light }}>
            <FadeIn in key={type}>
                <Typography variant="h3" component="h3" style={{ fontFamily: 'monospace' }}>
                    {state.user ? state.user?.display_name : ''}'s Top 10 {capitalize(type)}
                </Typography>
            </FadeIn>
            <div className="flex flex-1 flex-col">{mapRenderTops()}</div>
        </div>
    );
};

TopArtistsAndTracks.propTypes = {
    type: PropTypes.oneOf(['artists', 'tracks']),
};

TopArtistsAndTracks.defaultProps = {
    type: 'artists',
};
