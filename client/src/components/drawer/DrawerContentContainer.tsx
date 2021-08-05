import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Drawer, List, ListItem } from '@material-ui/core';
import { Palette } from '@material-ui/core/styles/createPalette';
import React, { useCallback, useContext } from 'react';
import { AppCtx } from '../../context';
import { SpotifyRes } from '../../type-defs';
import { AblumItem, ArtistItem, TrackItem } from '../common-ui';

const DrawerContent = ({
    handleRemoveSelected,
    palette,
    handleConfirmReset,
    handleToggleDrawer,
    handleBuildPlaylistItems,
    artistCount,
    trackCount,
    albumCount,
}: {
    handleRemoveSelected: any;
    palette: Palette;
    handleConfirmReset: any;
    handleToggleDrawer: any;
    handleBuildPlaylistItems: any;
    artistCount: number;
    trackCount: number;
    albumCount: number;
}) => {
    const { state } = useContext(AppCtx);

    //#region renders
    const renderDeleteIcon = useCallback(
        (item: SpotifyRes) => {
            const removeItem = () => handleRemoveSelected(item);
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    className="drawer-remove-icon"
                    key={`remove-icon-${item.id}`}
                    style={{ boxShadow: '2px 2px 10px 1px rgba(0, 0, 0, 0.3)' }}
                >
                    <FontAwesomeIcon
                        title="Remove item"
                        icon={faTrash}
                        color={palette.success.dark}
                        onClick={removeItem}
                        size="2x"
                    />
                </Button>
            );
        },
        [palette, handleRemoveSelected],
    );

    const renderSelectedItems = useCallback(() => {
        return state.selected
            .sort((a, b) => a.type.localeCompare(b.type))
            .map((item: SpotifyRes) => {
                return (
                    <div className="drawer-listitem-container" key={`selected-${item.type}-${item.id}`}>
                        <ListItem
                            key={`selected-${item.type}-${item.id}`}
                            className="drawer-listitem"
                            style={{ justifyContent: 'space-between' }}
                        >
                            {item.type === 'artist' && <ArtistItem {...item} />}
                            {item.type === 'track' && <TrackItem {...item} />}
                            {item.type === 'album' && <AblumItem {...item} />}
                        </ListItem>
                        {renderDeleteIcon(item)}
                    </div>
                );
            });
    }, [state.selected, renderDeleteIcon]);

    const renderClearButton = useCallback(() => {
        if (!state.selected || !!!state.selected.length) return null;
        return (
            <React.Fragment>
                <Button variant="outlined" color="secondary" onClick={handleConfirmReset} title="Clear selected">
                    <div>Clear</div>
                </Button>
            </React.Fragment>
        );
    }, [state.selected, handleConfirmReset]);

    const renderCloseButton = useCallback(() => {
        return (
            <div className="flex" style={{ marginTop: '0.5rem' }}>
                <Button variant="outlined" color="secondary" onClick={handleToggleDrawer} title="Close drawer">
                    <div>Close</div>
                </Button>
            </div>
        );
    }, [handleToggleDrawer]);

    const renderGeneratePlaylistButton = useCallback(() => {
        if (!state.selected || !!!state.selected.length) return null;

        return (
            <div className="flex" style={{ justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    className="flex flex-row flex-align-center"
                    style={{ justifyContent: 'space-around', padding: '0.5rem 2rem' }}
                    onClick={handleBuildPlaylistItems}
                    disabled={!!!state.selected.length || state.creatingPlaylist}
                >
                    <FontAwesomeIcon icon={faPlay} color={palette.text.primary} size="1x" />
                    <div style={{ paddingLeft: '1rem' }}>Generate Playlist</div>
                </Button>
            </div>
        );
    }, [state.selected, palette, handleBuildPlaylistItems, state.creatingPlaylist]);
    //#endregion

    // main render
    return (
        <Drawer open={state.openDrawer} onClose={handleToggleDrawer} anchor="right" id="drawer">
            <List
                id="drawer-list"
                className="flex flex-1 flex-col"
                style={{ margin: 0, padding: 0, backgroundColor: palette.success.light }}
            >
                <div id="drawer-header" style={{ backgroundColor: palette.success.dark }}>
                    <div id="drawer-header-text">
                        <h5 className="flex flex-align-center" style={{ fontFamily: 'monospace' }}>
                            {state.selected.length} Selected Items:
                        </h5>
                        <div>
                            <span>{artistCount} artists, </span>
                            <span>{trackCount} tracks, </span>
                            <span>{albumCount} albums</span>
                        </div>
                    </div>
                    <div className="flex">
                        {renderGeneratePlaylistButton()}
                        <div className="flex flex-col flex-justify-center" style={{ marginLeft: '1rem' }}>
                            {renderClearButton()}
                            {renderCloseButton()}
                        </div>
                    </div>
                </div>
                {renderSelectedItems()}
                <div id="drawer-list-bottom-gradient" />
            </List>
        </Drawer>
    );
};

export const DrawerContentContainer = React.memo(DrawerContent);
