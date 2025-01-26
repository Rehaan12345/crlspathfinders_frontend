<script>
    import { onMount } from 'svelte';
    import { getCollection, getCollectionDoc } from '../../../lib/api';
    import {
        Button,
        Input,
        Label,
        Modal,
        Select,
        Sidebar,
        SidebarGroup,
        SidebarItem,
        SidebarWrapper,
        Spinner
    } from 'flowbite-svelte';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';
    import {
        ArrowRightAltSolid,
        BarsFromLeftOutline,
        CalendarEditOutline,
        CircleMinusSolid,
        CirclePlusSolid
    } from 'flowbite-svelte-icons';
    import AllInfoData from './AllInfoData.svelte';
    import { addDocument } from '$lib/allinfo';

    let wholeReady = writable(false);
    let currCollection = writable("");
    let showSidebar = writable(true);
    let showAddInfo = writable(false);
    let isLoading = writable(false);
    let allInfo;
    let specInfo = [];
    let searching = "";
    let clickedCollection = "";
    let wholeCollection = {};
    let selected;
    let fieldCount = 1;
    let currDoc = {};
    let docName;
    let currField;
    let currVal;
    let listFieldsCount = 1;
    let currListVal;
    
    let types = [
        { value: "list", name: "list" },
        { value: "string", name: "string" },
        { value: "int", name: "int" },
        { value: "dict", name: "dict" }
    ];
    
    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    $: activeUrl = $page.url.pathname;
    const showData = (clicked, spec) => {
        // console.log(clicked + " has been clicked!");
        currCollection.set(clicked);
        clickedCollection = clicked;
        wholeCollection = spec;
    }
    const handleAddItem = async () => {
        isLoading.set(true);
        try {
            await addDocument(currDoc);
        } catch (error) {
            console.log(error);
        } finally {
            isLoading.set(false);
        }
    }
    onMount(async() => {
        wholeReady.set(false);
        allInfo = await getCollection("AllInfo");
        for (let i = 0; i < allInfo.length; i++) {
            const data = await getCollectionDoc("AllInfo", allInfo[i].id)
            console.log(data);
            const spec = {
                id: allInfo[i].id,
                info: data
            }
            specInfo.push(spec)
        }
        console.log(specInfo);
        wholeReady.set(true);
    })
</script>

<style>
    .wholeallinfowrapper {
        display: flex;
        justify-content: space-between;
    }
    .allinfodatawrapper {
        overflow: auto;
    }
    .showhidesidebarwrapper {
        padding-right: 1rem;
    }
/* 
    .listwrapper {
        padding: 1;
    } */
    .fieldwrapper {
        margin-top: 1rem;
        display: flex;
        justify-content: space-evenly;
        float: left;
        gap: 3rem;
        /* align-items: center; */
        /* gap: 5rem; */
    }
    .minusbuttonwrapper {
        display: flex;
        padding: 1.3rem;
    }
</style>

<Modal
    title="Add Info"
    open={$showAddInfo}
    on:close={() => {showAddInfo.set(false);}}>
    <form on:submit={handleAddItem}>
        <div>
            <div class="sm:col-span-2">
                <Label for="docname" class="mb-2">Document Name</Label>
                <Input type="text" id="docname" placeholder="Doc name" required bind:value={docName} on:change={() => { currDoc["id"] = docName; console.log(currDoc); }}/>
            </div>
            {#each {length: fieldCount} as _, i}
                <div class="w-full">
                    <div class="fieldwrapper">
                        <div class="field">
                            <Label for="field_{i+1}" class="mb-2">Field { i + 1 }</Label>
                            <Input type="text" id="field_{i+1}" placeholder="field123" bind:value={currField} required/>
                        </div>
                        <Label>
                            Field Type { i + 1 }
                            <Select class="mt-2" items={types} bind:value={selected} required />
                        </Label>
                    </div>
                    {#if selected == "string"}
                        <div class="w-full">
                            <Label for="{selected}_value_{i+1}" class="mb-2">Value</Label>
                            <Input type="text" id="{selected}_value_{i+1}" placeholder="string value" bind:value={currVal} required on:change={() => {
                                currDoc[currField] = currVal;
                                console.log(currDoc);
                            }}/>
                        </div>
                    {:else if selected == "int"}
                        <div class="w-full">
                            <Label for="{selected}_value_{i+1}" class="mb-2">Value</Label>
                            <Input type="number" id="{selected}_value_{i+1}" placeholder="number value" bind:value={currVal} required on:change={() => {
                                currDoc[currField] = currVal;
                                console.log(currDoc);
                            }}/>
                        </div>
                    {:else if selected == "list"}
                        <div class="w-full">
                            <div class="listwrapper" style="margin-left:2rem;">
                                {#each {length: listFieldsCount} as _, j}
                                    <div class="listdivone">
                                        <Label for="{selected}_value_{j+1}" class="mb-2">Value</Label>
                                        <Input type="text" id="{selected}_value_{j+1}" placeholder="string value" bind:value={currListVal} required on:change={() => {
                                            if (currDoc[currField] == undefined) { 
                                                currDoc[currField] = [];
                                                currDoc[currField].push(currListVal);
                                                console.log(currDoc);
                                            }
                                            else { 
                                                currDoc[currField].push(currListVal);
                                                console.log(currDoc);
                                             } 
                                        }}/>
                                    </div>
                                    <Button size="xs" outline color="purple" on:click={() => {listFieldsCount++;}}><CirclePlusSolid></CirclePlusSolid></Button>
                                {/each}
                            </div>
                        </div>
                    {:else if selected == "dict"}
                        dict
                    {/if}
                    <br>
                    <div class="minusbuttonwrapper">
                        <Button outline size="sm" color="dark" on:click={() => {fieldCount --; }}><CircleMinusSolid></CircleMinusSolid></Button>
                    </div>
                </div>
                <br>
            {/each}
        </div>
        <br>
        <div class="w-full">
            <Button outline color="purple" class="w-32" on:click={() => {fieldCount++; }}>Add field</Button>
        </div>
        <br>
        <Button class="w-full" type="submit" color="blue">
            {#if $isLoading}
                Loading <Spinner color="blue" size={4}/>
            {:else}
                Add Item
            {/if}
        </Button>
      </form>
</Modal>

{#if $wholeReady}

    <div class="wholeallinfowrapper">

        {#if $showSidebar}
            <div class="sidebarwrapper">
                <div class="showhidesidebarwrapper">
                    <Button size="sm" outline color="light" on:click={() => {
                        console.log("clicked");
                        showSidebar.set(!$showSidebar);
                    }}>
                        <BarsFromLeftOutline color="black" size="lg" style="cursor:pointer;"></BarsFromLeftOutline>
                    </Button>
                </div>

                <Sidebar {activeUrl}>
                    <SidebarWrapper>
                        <SidebarGroup>
                        {#each specInfo as spec, i}
                            <SidebarItem label={spec.id} on:click={() => {
                                showData(spec.id, spec)
                            }}>
                                <svelte:fragment slot="icon">
                                    <ArrowRightAltSolid></ArrowRightAltSolid>
                                </svelte:fragment>
                            </SidebarItem>
                        {/each}
                            <SidebarItem label="Add Info" on:click={() => {showAddInfo.set(true);}}>
                                <svelte:fragment slot="icon">
                                    <CalendarEditOutline size="lg"></CalendarEditOutline>
                                </svelte:fragment>
                            </SidebarItem>
                        </SidebarGroup>
                    </SidebarWrapper>
                </Sidebar>
            </div>
        {:else}
            <div class="showhidesidebarwrapper">
                <Button size="sm" outline color="light" on:click={() => {
                    showSidebar.set(!$showSidebar);
                }}>
                    <BarsFromLeftOutline color="black" size="lg" style="cursor:pointer;"></BarsFromLeftOutline>
                </Button>
            </div>
        {/if}
        <div class="allinfodatawrapper">
            {#if $currCollection.length > 1}
                <AllInfoData {clickedCollection} {wholeCollection}></AllInfoData>
            {/if}
        </div>
    </div>

{:else}

    <center>Loading ... <Spinner color="red"/></center>
