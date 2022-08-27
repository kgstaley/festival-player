import React from 'react';

import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TextField } from '@material-ui/core';
import { Palette } from '@material-ui/core/styles/createPalette';

interface Props {
    handleSearchChange: (query: string) => void;
    query: string;
    handleKeyUp: React.KeyboardEventHandler<HTMLDivElement>;
    handleClear: () => void;
    palette: Palette;
}

const _DashSearch = (props: Props) => {
    return (
        <React.Fragment>
            <div className="flex flex-col">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search for an artist, track or album"
                    onChange={(event) => props.handleSearchChange(event.target.value)}
                    value={props.query}
                    type="text"
                    onKeyUp={props.handleKeyUp}
                    inputProps={{
                        style: {
                            color: props.palette.primary.main,
                            border: `${props.palette.primary.dark} 2px solid`,
                            borderRadius: '4px',
                        },
                    }}
                />
                <Button
                    variant="contained"
                    className="clear-button"
                    onClick={props.handleClear}
                    disabled={!props.query}
                >
                    <FontAwesomeIcon icon={faTimesCircle} color={props.palette.secondary.main} size="sm" />
                    <div>Clear search</div>
                </Button>
            </div>
        </React.Fragment>
    );
};

export const DashSearch = React.memo(_DashSearch);
