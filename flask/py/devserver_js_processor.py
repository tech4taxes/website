""" devserver_js_processor.py
This is lifted from https://jmh.me/blog/bundle-typescript-scss-python-flask-vite
The code here is intended to help the flask devserver load & hot reload updated
assets in conjunction with the vite devserver.

Deviations from copypasta will likely be to support our weird file paths.
"""

import functools
import json
import os

from typing import Optional

from flask import current_app

from markupsafe import Markup


@functools.lru_cache(maxsize=1)
def _get_asset_manifest() -> dict[str, dict]:
    """
    Get the asset manifest (in website/.vite/manifest.json)
    """
    with open(
        # TODO: add ../ somewhere in here???
        os.path.join(current_app.root_path, ".vite", "manifest.json"),
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


@functools.lru_cache(maxsize=None)
def _get_manifest_chunk(name: str) -> Optional[dict]:
    """
    Get a manifest entry by name
    """
    manifest = _get_asset_manifest()
    return next((c for c in manifest.values() if c["name"] == name), None)


def module_path_processor(name: str) -> str:
    """
    Context processor to get the path of a module as defined in the asset manifest
    If running in development mode, return the file served from the Vite dev server
    """
    vite_dev_server = current_app.config["VITE_DEV_SERVER"]

    if vite_dev_server is not None:
        # TODO - check that this path is correct
        return f"{vite_dev_server}/vite-src/{name}/index.ts"

    chunk = _get_manifest_chunk(name)

    if chunk is None:
        return ""

    return chunk["file"][len("static") :]


def module_style_processor(name: str) -> Markup:
    """
    Context processor to get stylesheets associated with a module (applies only to production)
    If running in development mode, stylesheets are served dynamically by the Vite dev server
    """
    if current_app.config["VITE_DEV_SERVER"] is not None:
        return Markup()

    chunk = _get_manifest_chunk(name)

    if chunk is None or "css" not in chunk:
        return Markup()

    result = ""

    for css in chunk["css"]:
        dist_path = css[len("static") :]
        result += f'<link rel="stylesheet" href="{dist_path}">'

    return Markup(result)
