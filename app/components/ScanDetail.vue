<template>
    <Page class="page">
        <ActionBar title="Permit Scan Details">
            <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="this.$navigateBack" />
        </ActionBar>
        <ScrollView>
            <StackLayout orientation="vertical" horizontalAlignment="center" margin="20">
                <StackLayout marginBottom="30">
                    <Label :text="'Permit number: ' + item.permit.permit_number" fontSize="22" /> -->
                    <Label :text="'Valid: ' + item.valid" fontSize="18"/> -->
                    <Label :text="'Scanned at: ' + item.created_at" textWrap="true" fontSize="18"/>
                </StackLayout>
                <StackLayout marginBottom="30">
                    <Label>
                        <FormattedString>
                            <Span text="Permit Details" underline="true" fontAttributes="Bold" fontSize="30"></Span>
                        </FormattedString>
                    </Label>
                    <Label :text="'Valid from: ' + item.permit.valid_from" fontSize="18"/> 
                    <Label :text="'Expires on: ' + item.permit.expires_on" fontSize="18"/>
                    <Label :text="'Goods Description: ' + item.permit.goods_description" fontSize="18"/> 
                    <Label :text="'Origin: ' + item.permit.origin" fontSize="18"/> -->
                    <Label :text="'Destination: ' + item.permit.destination" fontSize="18"/> 
                    <Label :text="'Created at: ' + item.permit.created_at" fontSize="18"/> 
                    <Label :text="'updated at: ' + item.permit.updated_at" fontSize="18"/>
                </StackLayout>
                
                <Label>
                    <FormattedString>
                        <Span text="Occupant Details" underline="true" fontAttributes="Bold" fontSize="30"></Span>
                    </FormattedString>
                </Label>
                <StackLayout v-for="occupant in item.occupants" marginBottom="10" v-bind:key="occupant.id">
                    <FlexboxLayout flexDirection="column" class="details" >
                        <Label :text=" 'Name: ' + occupant.name" class="t-12" fontSize="18"/>
                        <Label :text=" 'ID: ' + occupant.reg_document_number" class="t-12" fontSize="18"/>
                        <Label :text=" 'Phone: ' + occupant.phone" class="t-12" fontSize="18"/>
                        <Label :text=" 'Phone: ' + occupant.email" class="t-12" fontSize="18"/>
                    </FlexboxLayout>
                </StackLayout>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    export default {
        props: ["scan"],
        data() {
            return {
                item: this.scan 
            }
        },
    }
</script>

<style scoped>
.details {
    border-color: #404040;
    border-width: 0 0 2 0;
    padding-bottom: 40px;
}
</style>