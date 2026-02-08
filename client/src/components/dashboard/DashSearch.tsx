import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TextField } from '@mui/material';
import { Palette } from '@mui/material/styles';
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
                        style: {
                            color: palette.primary.main,
                            border: `${palette.primary.main} 2px solid`,
                            borderRadius: '4px',
                        },
                    }}
                />
                <Button variant="contained" className="clear-button" onClick={handleClear} disabled={!!!query}>
                    <FontAwesomeIcon icon={faTimesCircle} color={palette.secondary.main} size="sm" />
                    <div>Clear search</div>
                </Button>
            </div>
        </React.Fragment>
    );
};

export const DashSearch = React.memo(_DashSearch);
