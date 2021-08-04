import { faList, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Drawer, List, ListItem, Typography, useTheme } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { logger } from '../common-util';
import { actions, AppCtx } from '../context';
import { ArtistItem, TrackItem } from './common-ui';

const _Drawer = (_props: any) => {
    const { state, dispatch } = useContext(AppCtx);
    const theme = useTheme();
    const palette = useMemo(() => theme.palette, [theme]);

    const handleToggleDrawer = useCallback(() => {
        dispatch({ type: actions.TOGGLE_DRAWER });
    }, [dispatch]);

    useEffect(() => {
        logger('state.selected in Drawer', state.selected);
    }, [state.selected]);

    const renderSelectedItems = useCallback(() => {
        return state.selected.map((item) => (
            <ListItem
                key={`selected-${item.type}-${item.id}`}
                className="flex flex-row"
                style={{ marginBottom: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'space-between' }}
            >
                {item.type === 'artist' && <ArtistItem {...item} />}
                {item.type === 'track' && <TrackItem {...item} />}
            </ListItem>
        ));
    }, [state.selected]);

    const renderCreatePlaylistButton = useCallback(() => {
        if (!state.selected || !!!state.selected.length) return null;

        return (
            <div className="flex" style={{ justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    className="flex flex-row flex-align-center"
                    style={{ justifyContent: 'space-around', padding: '0.5rem 2rem' }}
                >
                    <FontAwesomeIcon icon={faPlay} color={palette.text.primary} size="1x" />
                    <div style={{ paddingLeft: '1rem' }}>Generate Playlist</div>
                </Button>
            </div>
        );
    }, [state.selected, palette]);

    const renderContent = useCallback(() => {
        if (!!!state.selected.length) return null;
        return (
            <div id="drawer-container">
                <Button variant="contained" color="primary" onClick={handleToggleDrawer} title="View selected items">
                    <FontAwesomeIcon icon={faList} color={palette.info.light} size="2x" />
                </Button>
                <Drawer open={state.openDrawer} onClose={handleToggleDrawer} anchor="right" id="drawer">
                    <List
                        id="drawer-list"
                        className="flex flex-1 flex-col"
                        style={{ margin: 0, padding: 0, backgroundColor: palette.success.light }}
                    >
                        <Typography
                            variant="h5"
                            component="h5"
                            id="drawer-header"
                            className="flex flex-align-center"
                            style={{ backgroundColor: palette.success.dark }}
                        >
                            {state.selected.length} Selected Items:
                            {renderCreatePlaylistButton()}
                        </Typography>
                        {renderSelectedItems()}
                        <div id="drawer-list-bottom-gradient" />
                    </List>
                </Drawer>
            </div>
        );
    }, [
        handleToggleDrawer,
        palette,
        renderCreatePlaylistButton,
        renderSelectedItems,
        state.openDrawer,
        state.selected,
    ]);

    // main render
    return renderContent();
};

const DrawerItem = React.memo(_Drawer);

export default DrawerItem;
