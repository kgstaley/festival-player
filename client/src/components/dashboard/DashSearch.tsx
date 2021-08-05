import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TextField } from '@material-ui/core';
import { Palette } from '@material-ui/core/styles/createPalette';
import React from 'react';

const _DashSearch = ({
    handleSearchChange,
    query,
    handleKeyUp,
    handleClear,
    palette,
}: {
    handleSearchChange: any;
    query: string;
    handleKeyUp: any;
    handleClear: any;
    palette: Palette;
}) => {
    // main render

    return (
        <React.Fragment>
            <div className="flex flex-col">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search for an artist, track or album"
                    onChange={handleSearchChange}
                    value={query}
                    type="text"
                    onKeyUp={handleKeyUp}
                    inputProps={{
                        style: { color: 'white', border: '1px white solid', borderRadius: '4px' },
                    }}
                />
                <Button
                    variant="contained"
                    className="flex flex-1 clear-button"
                    onClick={handleClear}
                    style={{ marginTop: '1rem', color: 'white', borderColor: 'white' }}
                    disabled={!!!query}
                >
                    <FontAwesomeIcon icon={faTimesCircle} color={palette.success.main} size="sm" />
                    <div style={{ marginLeft: '8px', fontSize: '12px', color: palette.success.main }}>Clear search</div>
                </Button>
            </div>
        </React.Fragment>
    );
};

export const DashSearch = React.memo(_DashSearch);
