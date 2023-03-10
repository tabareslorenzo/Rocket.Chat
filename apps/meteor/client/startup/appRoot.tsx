import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';

import AppRoot from '../views/root/AppRoot';
import PageLoading from '../views/root/PageLoading';

const Root = lazy(() => import('../components/root/ErrorBoundary'));

declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		__BUGSNAG_KEY__: string;
	}
}

const createContainer = (): Element => {
	const container = document.getElementById('react-root');

	if (!container) {
		throw new Error('could not find the element #react-root on DOM tree');
	}

	document.body.insertBefore(container, document.body.firstChild);

	return container;
};

const container = createContainer();

render(
	window.__BUGSNAG_KEY__ ? (
		<Suspense fallback={<PageLoading />}>
			<Root>
				<AppRoot />
			</Root>
		</Suspense>
	) : (
		<AppRoot />
	),
	container,
);
